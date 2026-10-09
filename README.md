# The Fabrica book

This repository holds the text of the book published at
[fabricahq.com/book](https://fabricahq.com/book/). Write it in plain Markdown
with any text editor. The website turns these files into pages; nothing here
needs HTML or a build step.

The book is a work in progress, and contributions are welcome. Open an issue
for a correction or an idea, or send a pull request that follows the layout
below.

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
90-toolbox/                   an appendix: index.md says appendix: true
  index.md
```

- The book is a list of **chapters**. Each chapter is a folder with an
  `index.md`.
- A chapter holds **sections**. Each section is one Markdown file in the
  chapter's folder.
- `index.md` at the top holds the book's title in its front matter and the
  book's introduction as its body. The introduction opens the book's page on
  the website, beside the cover, so keep it to a few sentences; it can have
  more than one paragraph.
- Other folders, such as `images/`, can hold images and other files. They
  cannot hold Markdown.

## Order and numbers

Each chapter folder and section file name starts with a number and a hyphen,
such as `02-foundations` or `03-plan.md`. The numbers set the order and nothing
else.

Readers see numbers that come from that order:

- Chapters are numbered 1, 2, 3, and so on.
- Sections are numbered within their chapter: 2.1, 2.2, 2.3.
- Appendices are lettered A, B, C after the last chapter, with sections A.1,
  A.2.

So you never type a number into a title. To move a section, rename its file:
`05-merge.md` to `03-merge.md`. Everything renumbers. Gaps are fine, so
`10-`, `20-`, `30-` leaves room to insert `15-` later. Two files with the same
number in one folder are an error.

Page addresses use the name without its number, such as
`fabricahq.com/book/foundations/the-environment/`, so links keep working when
you reorder. Renaming the part after the number changes the address.

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
| `status`   | Chapters and sections   | `planned`, `draft`, or `solid`. Leave it out for `solid`.  |
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
and marks no rows. Once statuses differ, each chapter and section shows its
own circle, with a key explaining them: a hollow circle for planned, a
half-filled circle for draft, and a filled circle for written. Drafts are
labeled "Draft", and planned titles are lighter. Each page shows its own
status; a chapter's status says nothing about its sections.

## Writing

Use ordinary Markdown, including tables and code blocks. The page title is the
page's top heading, so start your own headings at `##`. Raw HTML shows as
text.

### Links and images

Link to other pages with relative paths to their files, the way they work on
GitHub:

```markdown
See [Plan](../03-the-dev-lifecycle/02-plan.md) and its
[checklist](../03-the-dev-lifecycle/02-plan.md#checklist).
Link a whole chapter by its folder: [Foundations](../02-foundations/).

![Three worktrees sharing one repository](images/worktrees.png)
```

- Links to headings use GitHub's anchors: lowercase, punctuation removed,
  spaces turned into hyphens.
- Images and linked files can be `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`,
  `.avif`, `.svg`, or `.pdf`. Only files a page uses are published.
- A link to a file that does not exist is an error. Links to other websites
  start with `https://`.

### Left out of the book

These are never published, so you can keep notes beside the book:

- Any file or folder whose name starts with `_`, such as `_notes.md` or
  `_drafts/`.
- Hidden files and folders, whose names start with `.`.
- `README.md` files, including this one.

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
