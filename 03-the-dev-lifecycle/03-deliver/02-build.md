---
title: Build
status: planned
---

## Building efficiently

- The naive way to build is just give your agent a prompt and let it rip
- Let's make one improvement at a time to unleash more leverage
  1. Tell the agent how to build: Skills, Rules (Syllabus by Fabrica)
  2. Give the human
     - Build first, then show the UX for human review
  3. Create a feedback loop by enabling the agent to *verify* its work. See [Verify](03-verify.md).

Of these, verification is the biggest unlock because it means the agent can do more without human oversight. You the human want to be reviewing deliverables, not validating correctness. 

## Building is when humans don't give feedback.

- The goal is to tee up the agent to do a bunch of work while you're away.
  - That means removing the human from the loop wherever possible.
- First, enable the agent to build the way you want by using **skills** and **rules** (See [Syllabus](https://syllabus.fabricahq.com))
- Second, settle all the questions about what you want to build upfront during [Plan](#). If you "want to see how it looks" as part of build, then you have to wait for build to give feedback.
- Third, enable the agent to [Verify](#) its own work.

If you've done all this successfully, then:

- Your agent knows exactly what to build
- You've told it what guidelines to follow when building it
- You've given it a way to verify its work

That means that by the time you come in to review the final product, you're going to validate that:

- It works the way you want
- Any new decisions that were made during the build align with your judgement

In theory, you shouldn't need to review any code.
