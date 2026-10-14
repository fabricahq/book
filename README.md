# The Fabrica book

This repository holds the text of the book published at
[fabricahq.com/book](https://fabricahq.com/book/). Write it in plain Markdown
with any text editor. The website turns these files into pages; nothing here
needs HTML or a build step.

The book is a work in progress, and contributions are welcome. Open an issue
for a correction or an idea, or send a pull request that follows the layout
below. Every page on the website ends with a "Suggest an edit to this page"
link, which opens the
[Suggest an edit](https://github.com/fabricahq/book/issues/new?template=suggest-an-edit.yml) issue form with
the page already filled in.

## How publishing works

1. You push to `main`.
2. A workflow in this repository asks
   [fabricahq/website](https://github.com/fabricahq/website) to sync the book.
3. The website copies these files, checks them, and checks the whole site.
4. If every check passes, the change lands on the website's `main` and
   publishes a few minutes later. If a check fails, nothing publishes. The
   failed "Sync book" run in the website's Actions tab lists each problem with
   the file to fix.

The website repository is public, so its sync commits and logs are public too.
Everything you push to `main` here will be on the website.

## Layout

```text
index.md                      the book's title, and its introduction as the body
01-introduction/              a chapter
  index.md                    the chapter's title and intro
  01-what-a-software-factory-is.md   a section
02-foundations/
  index.md
  01-a-codebase-agents-can-work-in.md
  02-the-environment.md
  images/worktrees.png        images, anywhere in the book
03-the-dev-lifecycle/
  index.md
  01-spark.md
  02-shape/                   a phase: a group of sections in a chapter
    index.md                  the phase's title and intro
    01-explore.md             a section of the phase
  03-deliver/
    index.md
    01-plan.md
90-toolbox/                   an appendix: index.md says appendix: true
  index.md
```

- The book is a list of **chapters**. Each chapter is a folder with an
  `index.md`.
- A chapter holds **sections**. Each section is one Markdown file in the
  chapter's folder.
- A chapter can group some of its sections into **phases**. A phase is a
  folder in the chapter holding its sections and an `index.md` with the
  phase's title and intro, like a chapter's. The phase gets its own page, and
  the contents lists it like a section, with its sections indented under it.
  Phases hold sections, not other phases.
- `index.md` at the top holds the book's title in its front matter and the
  book's introduction as its body. The introduction opens the book's page on
  the website, beside the cover, so keep it to a few sentences; it can have
  more than one paragraph.
- Other folders, such as `images/`, can hold images and other files. They
  cannot hold Markdown, because a folder of Markdown inside a chapter is a
  phase.

## Order and numbers

Each chapter folder, phase folder, and section file name starts with a number
and a hyphen, such as `02-foundations`, `02-shape`, or `03-plan.md`. The numbers
set the order and nothing else. A chapter's sections and phases share one order,
so `01-spark.md` comes before `02-shape/`.

Readers see numbers that come from that order:

- Chapters are numbered 1, 2, 3, and so on.
- Sections are numbered within their chapter: 2.1, 2.2, 2.3. A phase is
  numbered like a section, and its sections are numbered within it: phase 3.3
  holds 3.3.1, 3.3.2, and so on.
- Appendices are lettered A, B, C after the last chapter, with sections A.1,
  A.2.

So you never type a number into a title. To move a section, rename its file:
`05-merge.md` to `03-merge.md`. Everything renumbers. Gaps are fine, so
`10-`, `20-`, `30-` leaves room to insert `15-` later. Two files with the same
number in one folder are an error, and so are a file and a phase folder with
the same number.

Page addresses use the name without its number, and leave out any phase, such
as `fabricahq.com/book/foundations/the-environment/` and
`fabricahq.com/book/the-dev-lifecycle/explore/`. So links keep working when you
reorder, or when you move a section into or out of a phase. A phase's own page
sits beside its sections, at `fabricahq.com/book/the-dev-lifecycle/shape/`.
Renaming the part after the number changes the address, and no two phases or
sections in one chapter can share a name, even in different phases.

Names use lowercase letters, digits, and hyphens.

## Front matter

Each page can start with a few `key: value` lines between `---` lines:

```markdown
---
title: A codebase agents can work in
status: draft
---

The section's text starts here.
```

| Field      | Where                   | Meaning                                                    |
| ---------- | ----------------------- | ---------------------------------------------------------- |
| `title`    | Every page              | The page's title. Required, unless the file starts with a `# Title` line, which then becomes the title. |
| `status`   | Chapters, phases, and sections | `planned`, `draft`, or `solid`. Leave it out for `solid`.  |
| `subtitle` | A chapter's `index.md`  | Optional. One line shown in italics under the chapter's title, in the contents and on the chapter's page. |
| `appendix` | A chapter's `index.md`  | `true` makes the chapter an appendix. Appendices come after every chapter. |

Any other field is an error, so a typo such as `stauts` cannot hide.

### Status

- `planned`: an outline of what the page will cover. The page opens with a
  note that it is not written yet.
- `draft`: written but still changing. The page opens with a note that it may
  change.
- `solid`: finished, shown to readers as "Written". The page has no note.

While every page has the same status, the contents says so in one sentence
and marks no rows. Once statuses differ, each section shows its own circle,
with a key explaining them: a hollow circle for planned, a half-filled circle
for draft, and a filled circle for written. Hovering a circle names its status
too. Drafts are labeled "Draft", and planned titles, chapters included, are
lighter. Each page shows its own
status; a chapter's status says nothing about its sections.

## Writing

Use ordinary Markdown, including tables and code blocks. The page title is the
page's top heading, so start your own headings at `##`. Raw HTML shows as
text.

### Links and images

Link to other pages with relative paths to their files, the way they work on
GitHub:

```markdown
See [Plan](../03-the-dev-lifecycle/03-deliver/01-plan.md) and its
[checklist](../03-the-dev-lifecycle/03-deliver/01-plan.md#checklist).
Link a whole chapter or phase by its folder: [Foundations](../02-foundations/).

![Three worktrees sharing one repository](images/worktrees.png)
```

- Links to headings use GitHub's anchors: lowercase, punctuation removed,
  spaces turned into hyphens.
- Images and linked files can be `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`,
  `.avif`, `.svg`, or `.pdf`. Only files a page uses are published.
- A link to a file that does not exist is an error. Links to other websites
  start with `https://`.

### Diagrams

Draw a diagram with a [Mermaid](https://mermaid.js.org/) code block. GitHub
shows it as a diagram, and the website draws it in the site's colors, in light
and dark:

````markdown
```mermaid
flowchart LR
  accTitle: Where an agent runs
  accDescr: From least to most isolated: your machine, a worktree, a container.
  machine["Your machine"] --> worktree["A worktree"] --> container["A container"]
```
````

- `accTitle` names the diagram for screen readers, the way alt text names an
  image. It is required. `accDescr` adds an optional longer description.
- Flowcharts, state, sequence, class, and ER diagrams, and XY charts, are
  supported. A diagram that cannot be drawn is an error.

### Left out of the book

These are never published, so you can keep notes beside the book:

- Any file or folder whose name starts with `_`, such as `_notes.md` or
  `_drafts/`.
- Hidden files and folders, whose names start with `.`.
- Markdown files named in capitals, such as `README.md` (including this one),
  `CONTEXT.md`, and `AGENTS.md`. These are documents about the repository.

## Preview while writing

Run the website locally and read the book from this checkout. Pages update as
you save.

1. Check out [fabricahq/website](https://github.com/fabricahq/website) next to
   this repository, so the two folders are siblings, and install its tools as
   its README describes.
2. In the website checkout, run:

   ```sh
   bun run dev:book
   ```

3. Open the `/book/` address it prints.

If this checkout is somewhere else, set `BOOK_DIR=/path/to/book`. If it does
not exist yet, `dev:book` clones it for you.

Problems show in the terminal and in the browser, and the page reloads when
they are fixed. To check the book without the preview, run
`bun run book:check ../book` in the website checkout.
