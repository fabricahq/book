---
title: The hierarchy of bottlenecks
status: draft
---

Picture your first week with a coding agent. It writes code faster than you ever could, so you hand it more work. Soon you notice you're not writing code anymore. You're reading it. Every diff needs your eyes, because nothing else tells you whether it's right. The agent isn't the slow part. You are.

That's a bottleneck, and it won't be your last. This section is about the order you'll meet them in, because knowing what comes next tells you what to work on now.

## One bottleneck at a time

In _The Goal_, Eliyahu Goldratt tells the story of a scout troop on a hike. The troop can only move as fast as Herbie, its slowest hiker. Hurrying the kids at the front doesn't get anyone to camp sooner. It just stretches out the line. The only way to speed up the troop is to speed up Herbie.

Goldratt called this the Theory of Constraints. At any moment, one constraint limits what the whole system produces, and improving anything else is wasted effort. When you relieve that constraint, a new one takes its place.

A software factory works the same way. At any moment, one thing limits how much good work comes out of it. Fix that, and the limit moves somewhere else.

## The hierarchy

Here are the bottlenecks, in the order you'll usually meet them.

1. **Verification.** Can the work be confirmed right without you reading it? This is the bottleneck from the opening, and [Poteto](https://x.com/poteto) makes the case that it's where to start. Until checking work is cheap, every agent you add just adds to your reading. [Validate](../03-the-dev-lifecycle/03-deliver/03-validate.md) and [spending time on levers](04-principles.md#spend-time-on-levers) cover how to relieve it.
2. **Autonomy.** How long can one agent run before it needs you? Once you trust its work, you'll notice how often it stops to ask for a permission, a missing tool, or a decision it could have made itself. [Loops](../04-loops/) is about letting an agent finish a whole task without you.
3. **Attention.** How many agents can you direct at once? With agents that check their own work and run on their own, you'll want several. Now the limit is you again: which agent needs you, what was it doing, and when should you look? [Orchestration](../05-orchestration/) covers this.
4. **Integration.** How fast does parallel work land? Five agents can open five pull requests in an hour, but each one still has to pass CI, merge without conflicts, and deploy. If every change waits on a slow CI run and then conflicts with the one that merged ahead of it, your agents spend more time waiting than working. [Merge](../03-the-dev-lifecycle/03-deliver/04-merge.md) and [Deploy](../03-the-dev-lifecycle/03-deliver/05-deploy.md) cover this.
5. **Learning.** How fast does the factory stop repeating its mistakes? When each new agent session makes the same mistake the last one did, you pay for it again every time. [Self-improvement](../06-self-improvement/) is about making each lesson stick.

## Intent sits underneath

One thing isn't on the list: deciding what you want. No amount of verification or orchestration can tell the factory what to build. That's [the human's job](04-principles.md#use-the-human-for-what-only-the-human-can-do), and it stays the human's job.

So intent isn't a level you get past. It's the floor. The point of climbing the hierarchy is to reach the place where intent is the only bottleneck left, and the factory can build anything you can clearly describe.

## Why the order matters

Why not start with attention, and run lots of agents right away? Because without cheap verification, ten agents means ten times the reading. And without autonomy, ten agents means ten agents interrupting you. Each level pays off only once the ones below it are in place.

The strongest objection is that real work isn't this tidy. You'll hit a merge conflict on day one, and you'll learn lessons long before you run a second agent. That's true. The claim isn't that the other problems don't exist. It's that only one of them limits you right now, and that's where your time goes furthest.

The order isn't fixed, either. You can slide back down. A new codebase without tests puts you back at verification, and a new model might handle more on its own, or less. When something changes, check where you are.

## Finding your current bottleneck

The simplest test is to look at how you spent your day with agents.

- Reading diffs to check whether they're right? That's verification.
- Approving permissions, answering questions, or unblocking an agent? That's autonomy.
- Losing track of which agent needed you, or what it was working on? That's attention.
- Resolving merge conflicts or waiting on CI? That's integration.
- Correcting the same mistake for the second time? That's learning.

Whatever took most of your time is your bottleneck. Work on that one, and leave the rest for later. [Measuring the factory](../06-self-improvement/01-measuring-the-factory.md) covers how to answer this with numbers instead of a gut check.
