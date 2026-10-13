---
title: Overview
status: draft
---

Everything you ship goes through the same lifecycle. But depending on what you're shipping, you can skip some of its stages.

Here's the whole lifecycle:

1. [Spark](01-spark.md): something makes you want to change your software.
2. **Shape**, when the work is new or uncertain:
   1. [Explore](02-shape/01-explore.md): build a throwaway prototype to learn what you actually want.
   2. [Design](02-shape/02-design.md): choose the tech stack and the high-level architecture.
   3. [Slice](02-shape/03-slice.md): break the work into a sequence of small slices.
   4. [Document](02-shape/04-document.md): write down what you decided, so each slice can build from it.
3. **Deliver**, for each slice:
   1. [Plan](03-deliver/01-plan.md)
   2. [Build](03-deliver/02-build.md)
   3. [Validate](03-deliver/03-validate.md)
   4. [Merge](03-deliver/04-merge.md)
   5. [Deploy](03-deliver/05-deploy.md)
   6. [Retro](03-deliver/06-retro.md)
   7. [Operate](03-deliver/07-operate.md)

A one-line bug fix might go straight from spark to build, validate, merge, and deploy. A brand-new product uses every stage. Most work lands somewhere in between, and part of the skill is knowing which stages a change needs.

## Shape

Shaping is where you work out what to build and how to build it, before you commit to building it. You need it for a brand-new system, for a new feature, or for anything in between. You can usually skip it when you already know what you want and where it goes, as with most bug fixes and maintenance.

Shaping starts with an _appetite_: how much time this idea is worth to you. A two-day appetite and a six-week appetite lead to very different designs, so decide it before you start exploring.

I borrow both terms from Ryan Singer's [Shape Up](https://basecamp.com/shapeup). Singer shapes on paper, with rough sketches, because code used to be expensive. With agents, a working prototype costs about what a sketch did, so you can shape with real software.

Each shaping stage produces something:

| Stage   | Produces                                   |
| ------- | ------------------------------------------ |
| Explore | A prototype, and a clear vision of what to build |
| Design  | A tech stack and a high-level architecture |
| Slice   | A sequence of small slices                 |
| Document | A written record of what shaping decided  |

## Deliver

Each slice then goes through the rest of the lifecycle on its own, from plan to operate. What comes out the other end is a new feature, an improvement, or a bug fix running in production.
