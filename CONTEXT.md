# The Fabrica book

How the book is written in fabricahq/book, and how changes to it are recorded for readers. This file is also the `CONTEXT.md` of fabricahq/book; edit it here and copy it there, as with the book's README.

## Updates

**Update**:
A change to the book that readers would care about, described once for them however many commits it took. The commits that contributed to it are the ones that touched its changelog entry or named it.
_Avoid_: change, changeset, release

**Entry**:
The file in the book's `changes/` folder where the author describes one update for readers: its kind and a short summary linking to the pages it's about. Its file name is the update's name.
_Avoid_: changeset, release note

**Changelog**:
The list of updates readers can browse, newest first.
_Avoid_: release notes, history, git log

**Kind**:
What an update means for a reader: new, major update, minor update, or removed. An update has one kind, its most significant.
_Avoid_: type, category, severity

**Major update**:
An update that changes the book's guidance enough that a reader might think differently.
_Avoid_: rewrite, revision, restructure

**Minor update**:
An update that keeps a page's core message and says it better, including moving or renaming a page.
_Avoid_: tweak, polish, revision
