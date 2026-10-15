// Tests for commit-check.mjs, each against a throwaway book with its own history. Run them with:
//
//   node --test .github/commit-check/
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

const CHECK = new URL("./commit-check.mjs", import.meta.url).pathname;
const START = "2026-09-01T10:00:00-07:00";

/** An entry's text: its kind and title in front matter, then its summary. */
const entry = (title, summary = "What changed.", kind = "new") => `---\nkind: ${kind}\ntitle: ${title}\n---\n\n${summary}\n`;

/** A small book with a changelog of three updates. */
const BOOK = {
  "index.md": "---\ntitle: Book\n---\n",
  "01-one/index.md": "---\ntitle: One\n---\n",
  "01-one/01-first.md": "---\ntitle: First\n---\n\nThe first page.\n",
  "changes/first-draft.md": entry("Published the first draft of the book"),
  "changes/plan-wording.md": entry("Reworded the plan", "Clearer.", "minor-update"),
  "changes/retired-loops.md": entry("Removed the page on loops", "Gone.", "removed"),
  "changes/README.md": "Notes about the changelog are not an entry.\n",
};

/** A change to the first page and nothing else. */
const pageEdit = (more = "More.") => ({ "01-one/01-first.md": `---\ntitle: First\n---\n\nThe first page.\n\n${more}\n` });

/**
 * Run git in `dir` as a test author, untouched by the machine's git configuration and by any
 * repository a hook points at. `env` adds variables, such as the commit dates.
 */
function git(dir, args, env = {}) {
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")));
  const result = spawnSync("git", ["-C", dir, ...args], {
    encoding: "utf8",
    env: {
      ...inherited,
      GIT_CONFIG_GLOBAL: "/dev/null",
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_AUTHOR_NAME: "Test Author",
      GIT_AUTHOR_EMAIL: "author@example.com",
      GIT_COMMITTER_NAME: "Test Author",
      GIT_COMMITTER_EMAIL: "author@example.com",
      ...env,
    },
  });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed in ${dir}: ${result.stderr}`);
  return result.stdout;
}

/** Write `files` (path to text) into `dir`, and delete `removes`. */
async function write(dir, files, removes = []) {
  for (const [path, text] of Object.entries(files)) {
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), text);
  }
  for (const path of removes) await rm(join(dir, path));
}

/** Write `files` into `dir` and stage them, as an author does before committing. */
async function stage(dir, files) {
  await write(dir, files);
  git(dir, ["add", "--all"]);
}

/**
 * Run `use` with a throwaway checkout of `book` (path to text), removed afterwards. The first commit
 * adds the book on START, and each of `commits` then writes `files`, deletes `removes`, and commits
 * with `message` on its own `date`.
 */
async function withCheckout({ book = BOOK, commits = [] }, use) {
  const dir = await mkdtemp(join(tmpdir(), "book-commit-check-"));
  try {
    git(dir, ["-c", "init.defaultBranch=main", "init", "--quiet"]);
    const commit = (date, message) => {
      git(dir, ["add", "--all"]);
      git(dir, ["commit", "--quiet", "--no-verify", "--no-gpg-sign", "--allow-empty", "--message", message], { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date });
    };
    await write(dir, book);
    commit(START, "Start the book");
    for (const [index, { date, files = {}, removes = [], message = `Change ${index + 1}` }] of commits.entries()) {
      await write(dir, files, removes);
      commit(date, message);
    }
    return await use(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Run the check in `dir` with `args`, and `env` added to its environment, as the hooks and CI do. */
const check = (dir, args, env = {}) => spawnSync(process.execPath, [CHECK, ...args], { cwd: dir, encoding: "utf8", env: { ...process.env, ...env } });

/** Check the commit being made in `dir`, staging `files` first, with `message` as its message. */
async function checkStaged(dir, files, message) {
  await stage(dir, files);
  await writeFile(join(dir, ".git/COMMIT_EDITMSG"), message);
  return check(dir, ["--message", ".git/COMMIT_EDITMSG"]);
}

/**
 * Install the check as `dir`'s prepare-commit-msg and commit-msg hooks, as .pre-commit-config.yaml
 * does, and return a function that runs git commit there with `args`, editing messages with no
 * editor.
 */
async function withHook(dir) {
  for (const [hook, mode] of [["prepare-commit-msg", "--prepare"], ["commit-msg", "--message"]]) {
    await writeFile(join(dir, ".git/hooks", hook), `#!/bin/sh\nexec "${process.execPath}" "${CHECK}" ${mode} "$@"\n`);
    await chmod(join(dir, ".git/hooks", hook), 0o755);
  }
  return (args) =>
    spawnSync("git", ["-C", dir, "-c", "user.name=A", "-c", "user.email=a@example.com", "-c", "core.editor=true", "commit", "--quiet", "--no-gpg-sign", ...args], { encoding: "utf8" });
}

/** The lines that say what is wrong: everything before the guide. */
const problemsOf = (stderr) => stderr.slice(0, stderr.indexOf("\n\nEvery commit to the book")).trim().split("\n");

test("a commit being made passes when it edits an entry, names an existing one, or says it belongs to none", async () => {
  const messages = [
    ["Say more\n\nUpdate: plan-wording\n", "names an entry"],
    ["Say more\n\nUpdate: plan-wording\nUpdate: first-draft\n", "names several, a line each"],
    ["Say more\n\nUpdate: plan-wording, first-draft\n", "names several on one line"],
    ["Say more\n\nupdate: plan-wording\n", "spells the key in lowercase"],
    ["Say more\n\nCo-authored-by: A <a@example.com>\nUpdate: plan-wording\n", "has other trailers too"],
    ["Fix the README\n\nChangelog: none\n", "belongs to no update"],
    ["Say more\n\nUpdate: plan-wording\n# Please enter the commit message for your changes.\n# Update: nonexistent\n", "with git's comments, which are not the message"],
    ["Say more\n\nUpdate: plan-wording\n# ------------------------ >8 ------------------------\n# Do not modify or remove the line above.\ndiff --git a/x b/x\n+Update: nonexistent\n", "with the diff git commit --verbose shows"],
  ];
  for (const [message, why] of messages) {
    await withCheckout({}, async (dir) => {
      const { status, stderr } = await checkStaged(dir, pageEdit(), message);
      assert.equal(status, 0, `${why}: ${stderr}`);
    });
  }
  await withCheckout({}, async (dir) => {
    const edits = { "changes/plan-wording.md": entry("Reworded the plan", "Clearer still.", "minor-update") };
    assert.equal((await checkStaged(dir, edits, "Reword the plan update\n")).status, 0, "edits an entry, with no line naming it");
  });
  await withCheckout({}, async (dir) => {
    const files = { ...pageEdit(), "changes/merge-page.md": entry("Added a page on merging") };
    assert.equal((await checkStaged(dir, files, "Outline merging\n\nUpdate: merge-page\n")).status, 0, "names the entry it adds");
  });
});

test("a commit being made is rejected when it names no update, a missing one, or contradicts itself, saying why", async () => {
  const cases = [
    ["Say more\n", "This commit names no update."],
    ["Say more\n\nSee Update: plan-wording, earlier.\n", "This commit names no update.", "a mention that is not a closing trailer"],
    ["Update: plan-wording\n", "This commit names no update.", "a message that is only a trailer has no body to end"],
    ["Say more\n\nUpdate: plan-wordng\n", "This commit names the update plan-wordng, but no entry has that name."],
    ["Say more\n\nUpdate: plan-wording, nope\n", "This commit names the update nope, but no entry has that name."],
    ["Say more\n\nUpdate: README\n", "This commit names the update README, but no entry has that name.", "a file in changes/ that is not an entry"],
    ["Say more\n\nChangelog: none\nUpdate: plan-wording\n", "This commit says Changelog: none, but also names the update plan-wording."],
    ["Say more\n\nChangelog: later\n", 'This commit says "Changelog: later", but none is the only value a Changelog: line takes.'],
  ];
  for (const [message, problem, why = problem] of cases) {
    await withCheckout({}, async (dir) => {
      const { status, stderr } = await checkStaged(dir, pageEdit(), message);
      assert.equal(status, 1, why);
      assert.deepEqual(problemsOf(stderr), [problem], why);
    });
  }
  await withCheckout({}, async (dir) => {
    const edits = { "changes/plan-wording.md": entry("Reworded the plan", "Clearer still.", "minor-update") };
    const { status, stderr } = await checkStaged(dir, edits, "Reword the plan update\n\nChangelog: none\n");
    assert.equal(status, 1);
    assert.deepEqual(problemsOf(stderr), ["This commit says Changelog: none, but edits the entry changes/plan-wording.md."]);
  });
  await withCheckout({}, async (dir) => {
    // The author wrote the entry, but left it out of the commit.
    await stage(dir, pageEdit());
    await writeFile(join(dir, "changes/merge-page.md"), entry("Added a page on merging"));
    await writeFile(join(dir, ".git/COMMIT_EDITMSG"), "Outline merging\n\nUpdate: merge-page\n");
    const { status, stderr } = check(dir, ["--message", ".git/COMMIT_EDITMSG"]);
    assert.equal(status, 1);
    assert.deepEqual(problemsOf(stderr), ["This commit names the update merge-page, but no entry has that name; add changes/merge-page.md to this commit."]);
  });
});

test("a rejection says how to fix it and lists the updates changed most recently, by their latest commit of either kind", async () => {
  const history = {
    commits: [
      { date: "2026-10-01T09:00:00Z", files: { "changes/retired-loops.md": entry("Removed the page on loops", "Gone for good.", "removed") } },
      { date: "2026-10-02T09:00:00Z", message: "Say more\n\nUpdate: first-draft", files: pageEdit("Two.") },
      ...["a", "b", "c", "d"].map((name, i) => ({ date: `2026-09-1${i}T09:00:00Z`, files: { [`changes/old-${name}.md`]: entry(`"Old ${name}"`, "Old.", "minor-update") } })),
    ],
  };
  await withCheckout(history, async (dir) => {
    await stage(dir, { "changes/merge-page.md": entry("Added a page on merging") });
    const { status, stderr } = await checkStaged(dir, {}, "Outline merging\n\nUpdate: merge-pgae\n");
    assert.equal(status, 1);
    assert.equal(
      stderr.slice(stderr.indexOf("\n\n") + 2),
      `Every commit to the book belongs to an update, or says it doesn't. End the commit message with a
line naming its update, after a blank line:

    Update: <name>

The updates changed most recently:

    merge-page      Added a page on merging
    first-draft     Published the first draft of the book
    retired-loops   Removed the page on loops
    old-d           Old d
    old-c           Old c

A commit that edits an update's entry, changes/<name>.md, belongs to that update too, so to
start a new update, add its entry to the commit. If the commit changes nothing readers would
notice, such as a fix to the README, end it with this line instead:

    Changelog: none
`,
      "the entry being written first, then the latest by their commits' dates, five in all, each with its title",
    );
  });
});

test("a commit being made to a book without a changelog yet, or that concludes a merge, is not checked", async () => {
  const { "changes/first-draft.md": _, "changes/plan-wording.md": __, "changes/retired-loops.md": ___, ...withoutChangelog } = BOOK;
  await withCheckout({ book: withoutChangelog }, async (dir) => {
    assert.equal((await checkStaged(dir, pageEdit(), "Say more\n")).status, 0);
  });
  await withCheckout({}, async (dir) => {
    git(dir, ["switch", "--quiet", "-c", "side"]);
    await stage(dir, pageEdit("From the side."));
    git(dir, ["commit", "--quiet", "--no-verify", "--message", "Side work\n\nChangelog: none"]);
    git(dir, ["switch", "--quiet", "main"]);
    git(dir, ["merge", "--quiet", "--no-ff", "--no-commit", "side"]);
    assert.equal((await checkStaged(dir, {}, "Merge branch 'side'\n")).status, 0);
  });
});

test("as the commit-msg hook, the check sees exactly what git commit is about to record, even from a temporary index", async () => {
  await withCheckout({}, async (dir) => {
    const commit = await withHook(dir);
    // Staged: an entry edit. Committed: only the page given by path, through a temporary index.
    await stage(dir, { "changes/plan-wording.md": entry("Reworded the plan", "Clearer still.", "minor-update") });
    await write(dir, pageEdit());
    const rejected = commit(["--message", "Say more", "--", "01-one/01-first.md"]);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /^This commit names no update\.$/m);
    assert.equal(commit(["--message", "Say more\n\nUpdate: plan-wording", "--", "01-one/01-first.md"]).status, 0);
    assert.equal(commit(["--message", "Reword the plan update"]).status, 0, "the staged entry edit, committed on its own");
    // git commit --all stages into the index's lock file first.
    await write(dir, pageEdit("Even more."));
    assert.match(commit(["--all", "--message", "Say even more"]).stderr, /^This commit names no update\.$/m);
    assert.equal(commit(["--all", "--message", "Say even more\n\nUpdate: plan-wording"]).status, 0);
  });
});

test("amending a commit counts the changes it already had, unless it gives the commit a new message", async () => {
  await withCheckout({}, async (dir) => {
    const commit = await withHook(dir);
    assert.equal(commit(["--amend", "--no-edit"]).status, 0, "the first commit, which added every entry");
    await stage(dir, { "changes/plan-wording.md": entry("Reworded the plan", "Clearer still.", "minor-update") });
    assert.equal(commit(["--message", "Reword the plan update"]).status, 0);
    await write(dir, pageEdit());
    assert.equal(commit(["--all", "--amend", "--no-edit"]).status, 0, "a change added to a commit that edited an entry");
    assert.equal(commit(["--amend"]).status, 0, "its message edited in the editor");
    // With -m, git tells the hook only that the message was given, as for a new commit.
    const reworded = commit(["--amend", "--message", "Reword the plan update, more clearly"]);
    assert.match(reworded.stderr, /^This commit names no update\.$/m, "a new message with -m names the update");
    assert.equal(commit(["--amend", "--message", "Reword the plan update, more clearly\n\nUpdate: plan-wording"]).status, 0);
    await write(dir, pageEdit("Even more."));
    assert.match(commit(["--all", "--message", "Explain --amend"]).stderr, /^This commit names no update\.$/m, "a new commit is not an amend, whatever its message says");
    assert.equal(commit(["--all", "--message", "Say more\n\nUpdate: plan-wording"]).status, 0);
  });
});

test("prek's hooks note an amend from the source and commit it passes in the environment", async () => {
  await withCheckout({ commits: [{ date: "2026-10-01T09:00:00Z", message: "Reword the plan update", files: { "changes/plan-wording.md": entry("Reworded the plan", "Clearer still.", "minor-update") } }] }, async (dir) => {
    await stage(dir, pageEdit());
    await writeFile(join(dir, ".git/COMMIT_EDITMSG"), "Reword the plan update\n");
    const amend = { PRE_COMMIT_COMMIT_MSG_SOURCE: "commit", PRE_COMMIT_COMMIT_OBJECT_NAME: "HEAD" };
    assert.equal(check(dir, ["--prepare", ".git/COMMIT_EDITMSG"], amend).status, 0);
    assert.equal(check(dir, ["--message", ".git/COMMIT_EDITMSG"]).status, 0, "the amended commit edited an entry");
    assert.equal(check(dir, ["--prepare", ".git/COMMIT_EDITMSG"], { PRE_COMMIT_COMMIT_MSG_SOURCE: "message" }).status, 0);
    assert.equal(check(dir, ["--message", ".git/COMMIT_EDITMSG"]).status, 1, "a new commit edits only the page");
  });
});

test("commits already made pass or fail one by one, each against the entries it leaves the book with", async () => {
  const history = {
    commits: [
      { date: "2026-10-01T09:00:00Z", message: "Say more\n\nUpdate: plan-wording", files: pageEdit("One.") },
      { date: "2026-10-02T09:00:00Z", message: "Say even more", files: pageEdit("Two.") },
      { date: "2026-10-03T09:00:00Z", message: "Outline merging\n\nUpdate: merge-page", files: pageEdit("Three.") },
      { date: "2026-10-04T09:00:00Z", message: "Add the merging update", files: { "changes/merge-page.md": entry("Added a page on merging") } },
      { date: "2026-10-05T09:00:00Z", message: "Name the merging update\n\nUpdate: merge-page", files: pageEdit("Four.") },
      { date: "2026-10-06T09:00:00Z", message: "Retire the merging update", removes: ["changes/merge-page.md"] },
      { date: "2026-10-07T09:00:00Z", message: "Fix the README\n\nChangelog: none", files: { "README.md": "# The book\n" } },
    ],
  };
  await withCheckout(history, async (dir) => {
    const log = git(dir, ["log", "--format=%h %s"]).trim().split("\n");
    const id = (subject) => log.find((line) => line.endsWith(` ${subject}`)).split(" ")[0];
    const { status, stderr } = check(dir, ["HEAD"]);
    assert.equal(status, 1);
    assert.deepEqual(problemsOf(stderr), [
      "2 commits break the book's commit rule:",
      "",
      `  ${id("Outline merging")} ("Outline merging") names the update merge-page, but no entry has that name.`,
      `  ${id("Say even more")} ("Say even more") names no update.`,
    ], "newest first, as git log lists them: naming an entry before it exists fails, and naming one later deleted does not; the first commit, which adds the entries, passes");
    assert.match(stderr, /The updates changed most recently:/);
    assert.equal(check(dir, [`${id("Add the merging update")}^..HEAD`]).status, 0, "a range selects only its commits");
    assert.equal(check(dir, [`${id("Say even more")}^!`]).status, 1, "and one commit can be checked alone");
  });
});

test("commits already made are not checked before the changelog exists, nor when they merge", async () => {
  const history = {
    book: { "index.md": BOOK["index.md"], "01-one/index.md": BOOK["01-one/index.md"] },
    commits: [
      { date: "2026-09-02T09:00:00Z", message: "Add a page, long before the changelog", files: pageEdit() },
      { date: "2026-09-03T09:00:00Z", message: "Start the changelog", files: { "changes/first-draft.md": entry("Published the first draft of the book") } },
    ],
  };
  await withCheckout(history, async (dir) => {
    git(dir, ["switch", "--quiet", "-c", "side"]);
    await stage(dir, pageEdit("From the side."));
    git(dir, ["commit", "--quiet", "--no-verify", "--message", "Say more\n\nUpdate: first-draft"]);
    git(dir, ["switch", "--quiet", "main"]);
    git(dir, ["merge", "--quiet", "--no-ff", "--no-verify", "--message", "Merge the side work", "side"]);
    const { status, stderr } = check(dir, ["HEAD"]);
    assert.equal(status, 0, stderr);
  });
});

test("the check explains how to call it, and refuses anything but revisions to check", async () => {
  await withCheckout({}, async (dir) => {
    for (const args of [[], ["--message", "x", "HEAD"], ["--prepare", "x", "--message", "y"], ["--prepare", "x", "commit", "HEAD", "more"], ["--unknown"], ["--", "--all"], ["no-such-revision"]]) {
      const { status, stderr } = check(dir, args);
      assert.equal(status, 2, `${args.join(" ")}: ${stderr}`);
    }
    assert.match(check(dir, []).stderr, /^usage: node \.github\/commit-check\/commit-check\.mjs/);
    assert.match(check(dir, ["--", "--all"]).stderr, /^"--all" is not a revision/);
  });
});
