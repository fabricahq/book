---
title: Choosing which workflows to adopt
status: planned
---

## What this section will cover

- Choosing which workflows to adopt, and which to skip

## Different workflows for different work

- Different types of work call for different workflows, such as a bug fix, a new feature, or a dependency upgrade
- Different triggers, or [sparks](../03-the-dev-lifecycle/01-spark.md), start different workflows: an issue comes in, a user reports a bug, an alert fires, or your own proactive testing finds a problem
- Otherwise, every workflow uses the same concepts as the rest of the book: the stages of the [dev lifecycle](../03-the-dev-lifecycle/), and an orchestrator to run them
- Matt Pocock's [Software Factories for Real Engineers](https://www.aihero.dev/cohorts/software-factories-for-real-engineers-xdy1m) cohort teaches using GitHub Actions to automatically investigate, triage, assign, delegate, track, and review units of work

## A common workflow: from issue to fix

1. Trigger: an issue comes in, or proactive testing finds a problem
2. Investigate: an agent reproduces the problem and finds its cause
3. Triage: decide how much it matters, and whether to fix it now
4. Assign: decide who owns it, an agent or a person
5. Delegate: hand it to an agent to [build](../03-the-dev-lifecycle/03-deliver/02-build.md) and [verify](../03-the-dev-lifecycle/03-deliver/03-verify.md) the fix
6. Track: follow its progress, for example as a ticket captured by the [chief of staff](03-patterns.md#kicking-off-work-with-a-chief-of-staff)
7. Review: [validate](../03-the-dev-lifecycle/03-deliver/04-validate.md) the fix before it [merges](../03-the-dev-lifecycle/03-deliver/05-merge.md)
