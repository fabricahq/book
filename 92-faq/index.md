---
title: FAQs
appendix: true
---

## What is this book?

This book is an open guide to building a software factory, and anyone can help write it.

It started as a near real-time, distilled record of what I'm learning about how to structure a software factory. Putting my insights into book form forces me to organize them into a coherent mental model, and hopefully makes them useful to others, too.

But no one person has all the answers here. It's my hope that anyone who sees an opportunity to improve this book will do so. Ultimately, I'd like this to become a community-authored work.

## How can I contribute?

Every improvement is welcome, big or small: a whole new section, a new insight, a better example, a clearer explanation, or a typo fix.

- **Suggest an edit.** Every page ends with a "Suggest an edit to this page" link that opens an issue for that page.
- **Open an issue** in [fabricahq/book](https://github.com/fabricahq/book/issues/new/choose) to point out a problem or propose an idea.
- **Send a pull request** to [fabricahq/book](https://github.com/fabricahq/book) with the change itself. The repository's README explains how the pages are organized.

## How does this book get updated?

The book lives in [fabricahq/book](https://github.com/fabricahq/book) on GitHub. Contributions arrive as pull requests, which I review and merge.

My own insights come often, and they don't arrive in neat chunks, so I skip pull requests for those and commit straight to `main`.

To keep that history readable, every commit names the _update_ it belongs to: one meaningful change to the book, such as a new section or a rewrite. Git hooks enforce this, and if you send a pull request, I'll add the name when I merge it.

The book's [changelog](/book/changes/) lists updates rather than commits, so you see one entry per meaningful change instead of every small edit. To see every commit to a page, click the "Updated" date under its title.

<details>
<summary>Show me an example</summary>

Say I spend a few days writing the page on merging pull requests. Each commit ends with the same line:

```text
Outline the page on merging

Update: merge-page
```

```text
Explain how agents resolve merge conflicts

Update: merge-page
```

```text
Fix typos on the merge page

Update: merge-page
```

A short file, `changes/merge-page.md`, gives the update its title and says what changed. The changelog then shows all three commits as one update: "Added a page on merging pull requests."

</details>

## How do you know that everything in this book is accurate?

Everything here comes from building and running real software factories, either mine or those of contributors, or from people whose ideas we credit by name, and it gets revised as we learn more.

Of course, software factories are evolving literally by the day, and like everyone else, we're figuring it out as we go. So think of this book as a work in progress that reflects our best thinking so far. In time, I hope it converges on established industry best practices.

If you see something that's wrong or out of date, please [help fix it](#how-can-i-contribute).

## What do Planned, Draft, and Written mean?

Every page has a status, and the contents shows each one:

- **Planned:** has an outline, but is not yet written out.
- **Draft:** written, but not yet complete or polished.
- **Written:** finished, at least for now!

## How can I follow along?

Check the book's [changelog](/book/changes/), which lists every meaningful update. To see every change as it lands, watch [fabricahq/book](https://github.com/fabricahq/book) on GitHub.
