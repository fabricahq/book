---
title: Build
status: draft
---

## Building is when humans don't give feedback.

- The goal is to tee up the agent to do a bunch of work while you're away.
  - That means removing the human from the loop wherever possible.
- First, enable the agent to build the way you want by using **skills** and **rules** (See [Syllabus](https://syllabus.fabricahq.com))
- Second, limit what the agent can do by [readying your codebase](../../02-foundations/01-readying-your-codebase.md).
- Third, settle all the questions about what you want to build upfront during [Plan](01-plan.md). If you "want to see how it looks" as part of build, then you have to wait for build to give feedback.
- Fourth, enable the agent to [Verify](03-verify.md) its own work.

If you've done all this successfully, then:

- Your agent knows exactly what to build
- You've told it what guidelines to follow when building it
- You've given it a way to verify its work

That means that by the time you come in to review the final product, you're going to validate that:

- It works the way you want
- Any new decisions that were made during the build align with your judgement

In theory, you shouldn't need to review any code.

### What's the biggest bottleneck?

- I've listed build-readiness steps in chronological order, but in fact you should prioritize based on whatever the biggest bottleneck is. For most people, that's likely verification.