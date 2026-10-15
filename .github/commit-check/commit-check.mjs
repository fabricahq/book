/**
 * The book's commit rule: every commit belongs to an update, or says it doesn't. A commit belongs
 * to an update when it edits the update's entry in changes/, or names the update in an
 * "Update: <name>" line at the end of its message. It says it belongs to none with a
 * "Changelog: none" line. The README's changelog section explains the rule for authors.
 *
 *   node .github/commit-check/commit-check.mjs [--book <dir>] --message <file>
 *       The commit being made: its staged changes, and the message in <file>. The commit-msg
 *       hook in .pre-commit-config.yaml runs this.
 *   node .github/commit-check/commit-check.mjs [--book <dir>] <revision>...
 *       Commits already made, as git log selects them, such as origin/main..HEAD or <sha>^!.
 *       .github/workflows/check-commits.yml runs this.
 *
 * The book defaults to the current directory. Merge commits, and commits to a book that has no
 * changelog yet, are not checked. Exits 1 when a commit breaks the rule, saying how to fix it and
 * listing the updates changed most recently, and 2 when it cannot check.
 *
 * It needs only Node and git, so anyone can run it. fabricahq/website reads the changelog with
 * the same rules for what an entry is and how a commit names an update; keep the two in step.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";

/** The folder that holds the changelog's entries, one Markdown file per update. */
const CHANGES_DIR = "changes";

/** How many of the updates changed most recently a rejection lists. */
const RECENT_UPDATES = 5;

/** A reason the check could not run, as opposed to a commit that breaks the rule. */
class CheckError extends Error {}

/**
 * True for names the book leaves out: hidden files, drafts kept beside the book, and repository
 * documents named in capitals, such as README.md.
 */
const isIgnored = (name) =>
  name.startsWith(".") || name.startsWith("_") || name.toLowerCase() === "readme.md" || /^[A-Z][A-Z0-9_-]*\.md$/.test(name);

/** The name of the update whose entry is at `path`, or null when it is not an entry. */
const entryAt = (path) =>
  path.startsWith(`${CHANGES_DIR}/`) && path.endsWith(".md") && !path.split("/").some(isIgnored) ? basename(path, ".md") : null;

/** The update names Update: lines give, one per line or comma-separated. */
const namedUpdates = (values) =>
  values
    .flatMap((value) => value.split(","))
    .map((name) => name.trim())
    .filter(Boolean);

/**
 * Run git in `dir`, ignoring any GIT_DIR or similar inherited from a hook, so `dir` alone picks the
 * repository. A hook's index is kept, since `git commit <paths>` and `git commit --all` stage the
 * commit in a temporary one.
 */
function run(dir, args, input) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")));
  if (process.env.GIT_INDEX_FILE) env.GIT_INDEX_FILE = resolve(process.env.GIT_INDEX_FILE);
  return spawnSync("git", ["-C", dir, ...args], { encoding: "utf8", env, input, maxBuffer: 256 * 1024 * 1024 });
}

/** Run git in `dir` and return its output, or fail the check with git's error. */
function git(dir, args, input) {
  const result = run(dir, args, input);
  if (result.error || result.status !== 0) {
    throw new CheckError(`git ${args.join(" ")} failed in ${dir}: ${(result.stderr || result.error?.message || "").trim()}`);
  }
  return result.stdout;
}

/** The names of the entries among NUL-separated `paths`. */
const entriesIn = (paths) => paths.split("\0").map(entryAt).filter(Boolean);

/**
 * What is wrong with one commit, from the update names its Update: lines give, the values of its
 * Changelog: lines, the paths of the entries it edits, and the names of the entries it leaves the
 * book with. Empty when it follows the rule.
 */
function commitProblems({ named, changelog, edited, entries }) {
  const problems = [];
  const none = changelog.some((value) => value.toLowerCase() === "none");
  for (const value of changelog.filter((value) => value.toLowerCase() !== "none")) {
    problems.push(`says "Changelog: ${value}", but none is the only value a Changelog: line takes`);
  }
  if (none && named.length) problems.push(`says Changelog: none, but also names the update ${named.join(", ")}`);
  if (none && edited.length) problems.push(`says Changelog: none, but edits the entry ${edited.join(", ")}`);
  for (const name of named.filter((name) => !entries.has(name))) problems.push(`names the update ${name}, but no entry has that name`);
  if (!changelog.length && !named.length && !edited.length) problems.push("names no update");
  return problems;
}

/** The values of the trailers named `key` in `trailers`, as git interpret-trailers --parse prints them. */
const trailerValues = (trailers, key) =>
  trailers
    .split("\n")
    .map((line) => line.match(/^([^:]+):(.*)$/))
    .filter((match) => match && match[1].trim().toLowerCase() === key)
    .map((match) => match[2].trim());

/** The commit being made in `book`: its problems, or null when it is not checked. */
async function checkStaged(book, messageFile) {
  if (run(book, ["rev-parse", "--quiet", "--verify", "MERGE_HEAD"]).status === 0) return null;
  const entries = new Set(entriesIn(git(book, ["ls-files", "-z", "--", `${CHANGES_DIR}/`])));
  const edited = git(book, ["diff", "--cached", "--name-only", "--no-renames", "-z"]).split("\0").filter(entryAt);
  if (!entries.size && !edited.length) return null;
  // git commit --verbose shows the diff below a scissors line, which is not part of the message.
  const text = (await readFile(messageFile, "utf8")).split(/^# -+ >8 -+$/m)[0];
  const trailers = git(book, ["interpret-trailers", "--parse"], git(book, ["stripspace", "--strip-comments"], text));
  const named = namedUpdates(trailerValues(trailers, "update"));
  const problems = commitProblems({ named, changelog: trailerValues(trailers, "changelog"), edited, entries });
  // An entry the author wrote but has not staged is the likeliest reason a name has no entry.
  return problems.map((problem) => {
    const name = named.find((name) => problem === `names the update ${name}, but no entry has that name`);
    const path = `${CHANGES_DIR}/${name}.md`;
    return name && entryAt(path) && existsSync(join(book, path)) ? `${problem}; add ${path} to this commit` : problem;
  });
}

/** Each commit `revisions` select in `book` that breaks the rule, with its problems. */
function checkCommits(book, revisions) {
  const format = "%x01%H%x02%s%x02%(trailers:key=Update,valueonly,separator=%x03)%x02%(trailers:key=Changelog,valueonly,separator=%x03)";
  const log = git(book, ["log", "--no-merges", "--root", `--format=${format}`, "--name-only", "--no-renames", "-z", "--end-of-options", ...revisions, "--"]);
  const commits = [];
  for (const field of log.split("\0")) {
    const line = field.replace(/^\n/, "");
    if (line.startsWith("\x01")) {
      const [id, subject, update, changelog] = line.slice(1).split("\x02");
      commits.push({ id, subject: subject.trim(), named: namedUpdates(update.split("\x03")), changelog: changelog.split("\x03").map((value) => value.trim()).filter(Boolean), edited: [] });
    } else if (line && entryAt(line)) {
      commits.at(-1).edited.push(line);
    }
  }
  const failures = [];
  for (const commit of commits) {
    // A commit is checked against the entries it leaves the book with, so it can add the entry it names.
    const entries = new Set(entriesIn(git(book, ["ls-tree", "-r", "-z", "--name-only", commit.id, "--", `${CHANGES_DIR}/`])));
    if (!entries.size && !commit.edited.length) continue;
    const problems = commitProblems({ ...commit, entries });
    if (problems.length) failures.push({ commit, problems });
  }
  return failures;
}

/** For each update, the date of its latest commit: the newest that edited its entry or named it. */
function latestCommits(book) {
  const latest = new Map();
  if (run(book, ["rev-parse", "--quiet", "--verify", "HEAD"]).status !== 0) return latest;
  const log = git(book, ["log", "--format=%x01%cI%x02%(trailers:key=Update,valueonly,separator=%x03)", "--name-only", "--no-renames", "-z", "HEAD", "--"]);
  let date = null;
  // Newest first, so the first date seen for a name is its latest.
  const see = (name) => latest.has(name) || latest.set(name, Date.parse(date));
  for (const field of log.split("\0")) {
    const line = field.replace(/^\n/, "");
    if (line.startsWith("\x01")) {
      const [when, update] = line.slice(1).split("\x02");
      date = when;
      namedUpdates(update.split("\x03")).forEach(see);
    } else if (line && entryAt(line)) {
      see(entryAt(line));
    }
  }
  return latest;
}

/** The title in an entry's front matter, or "" when it has none. */
function titleOf(text) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const title = front.match(/^title:[ \t]*(.*?)[ \t]*\r?$/m)?.[1] ?? "";
  return title.replace(/^(["'])(.*)\1$/, "$2");
}

/** The updates changed most recently, as [name, title] pairs: entries not committed yet, then by their latest commit. */
function recentUpdates(book) {
  const latest = latestCommits(book);
  const when = (name) => latest.get(name) ?? Infinity;
  const paths = git(book, ["ls-files", "-z", "--", `${CHANGES_DIR}/`]).split("\0").filter(entryAt);
  const updates = paths.map((path) => ({ path, name: entryAt(path) }));
  updates.sort((a, b) => when(b.name) - when(a.name) || a.name.localeCompare(b.name));
  return updates.slice(0, RECENT_UPDATES).map(({ path, name }) => [name, titleOf(git(book, ["show", `:${path}`]))]);
}

/** How to follow the rule, with the updates changed most recently to name. */
function guide(recent) {
  const width = Math.max(...recent.map(([name]) => name.length));
  const listed = recent.map(([name, title]) => `    ${title ? `${name.padEnd(width)}   ${title}` : name}`);
  return [
    "Every commit to the book belongs to an update, or says it doesn't. End the commit message with a",
    "line naming its update, after a blank line:",
    "",
    "    Update: <name>",
    "",
    ...(listed.length ? ["The updates changed most recently:", "", ...listed, ""] : []),
    `A commit that edits an update's entry, ${CHANGES_DIR}/<name>.md, belongs to that update too, so to`,
    "start a new update, add its entry to the commit. If the commit changes nothing readers would",
    "notice, such as a fix to the README, end it with this line instead:",
    "",
    "    Changelog: none",
  ].join("\n");
}

const USAGE = "usage: node .github/commit-check/commit-check.mjs [--book <dir>] (--message <file> | <revision>...)";

async function main(args) {
  let parsed;
  try {
    parsed = parseArgs({ args, options: { book: { type: "string" }, message: { type: "string" } }, allowPositionals: true });
  } catch (error) {
    throw new CheckError(`${error.message}\n${USAGE}`);
  }
  const { values, positionals } = parsed;
  if (Boolean(values.message) === Boolean(positionals.length)) throw new CheckError(USAGE);
  const unsafe = positionals.find((revision) => revision.startsWith("-"));
  if (unsafe) throw new CheckError(`"${unsafe}" is not a revision\n${USAGE}`);
  const book = resolve(values.book ?? ".");
  let lines;
  if (values.message) {
    const problems = await checkStaged(book, resolve(values.message));
    if (!problems?.length) return 0;
    lines = problems.map((problem) => `This commit ${problem}.`);
  } else {
    const failures = checkCommits(book, positionals);
    if (!failures.length) return 0;
    const count = failures.length === 1 ? "1 commit breaks" : `${failures.length} commits break`;
    lines = [`${count} the book's commit rule:`, ""];
    for (const { commit, problems } of failures) {
      for (const problem of problems) lines.push(`  ${commit.id.slice(0, 7)} ("${commit.subject}") ${problem}.`);
    }
  }
  console.error(`${lines.join("\n")}\n\n${guide(recentUpdates(book))}`);
  return 1;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  if (!(error instanceof CheckError)) throw error;
  console.error(error.message);
  process.exitCode = 2;
}
