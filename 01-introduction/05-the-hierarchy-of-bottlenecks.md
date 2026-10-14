---
title: The hierarchy of bottlenecks
status: draft
---

In 1984, Eliyahu Goldratt published _The Goal_, a novel about running a factory. Its hero, Alex Rogo, manages a manufacturing plant that's losing money, and he has three months to turn it around or watch it close. Along the way, he learns the idea this section is built on.

## Herbie and the scout hike

The idea clicks for Alex on a weekend hike. He volunteers to lead his son's scout troop through the woods, lines the boys up single file, and sets off. Before long, the line has stretched far down the trail. The fastest kids at the front keep pulling ahead, gaps open up behind them, and the troop keeps falling behind schedule.

The problem is Herbie, the slowest hiker. The troop can't reach camp until Herbie does, so every minute the kids at the front gain is wasted. They just stop and wait for him.

So Alex changes the plan. He moves Herbie to the front of the line, where no one can outpace him. Then he opens Herbie's pack, finds it full of heavy things, and splits them among the other boys. Herbie speeds up, and so does the whole troop.

## Only the constraint matters

Goldratt called this the Theory of Constraints. In any system, one constraint sets the pace for the whole. Speed up the constraint, and everything speeds up. Speed up anything else, and nothing changes, just like the kids at the front who reached each stop early and waited for Herbie.

That's the key point, and it's easy to miss: time spent on anything other than the constraint is wasted, however much it feels like progress. And once you relieve the constraint, a new one takes its place.

A software factory works the same way. At any moment, one thing limits how much good work it produces. The rest of this section names those constraints, in the order you'll usually meet them.

## The hierarchy

```mermaid
flowchart BT
  accTitle: The hierarchy of bottlenecks
  accDescr: Five bottlenecks, met in order from the bottom up: verification, autonomy, attention, integration, and learning. Intent sits beneath them all.
  intent(["Intent: what do you want?"])
  verification("Verification: is the work right?")
  autonomy("Autonomy: how long can one agent run alone?")
  attention("Attention: how many agents can you direct?")
  integration("Integration: how fast does parallel work land?")
  learning("Learning: does the factory stop repeating mistakes?")
  intent -.- verification --> autonomy --> attention --> integration --> learning
```

You'll usually meet these from the bottom up.

### Verification

Can the work be confirmed right without you reading it? [Poteto](https://x.com/poteto) makes the case that this is where to start. Until checking is cheap, every agent you add just adds to your reading. See [Validate](../03-the-dev-lifecycle/03-deliver/03-validate.md) and [spending time on levers](04-principles.md#spend-time-on-levers).

### Autonomy

How long can one agent run before it needs you? Once you trust its work, you'll notice how often it stops for a permission, a missing tool, or a decision it could have made itself. See [Loops](../04-loops/).

### Attention

How many agents can you direct at once? The limit is you again: which agent needs you, and what was it doing? See [Orchestration](../05-orchestration/).

### Integration

How fast does parallel work land? Five agents can open five pull requests in an hour, but each one still has to pass CI, merge cleanly, and deploy. See [Merge](../03-the-dev-lifecycle/03-deliver/04-merge.md) and [Deploy](../03-the-dev-lifecycle/03-deliver/05-deploy.md).

### Learning

How fast does the factory stop repeating its mistakes? If each session makes the last one's mistake, you pay for it every time. See [Self-improvement](../06-self-improvement/).

### Intent

Beneath it all is deciding what you want. That's [the human's job](04-principles.md#use-the-human-for-what-only-the-human-can-do), and it never goes away. The point of climbing the hierarchy is to make intent the only bottleneck left.

## Why the order matters

Without cheap verification, ten agents means ten times the reading. Without autonomy, it means ten agents interrupting you. Each level pays off only once the ones below it are in place.

Real work isn't this tidy, and you'll hit a merge conflict on day one. But only one bottleneck limits you right now, and that's where your time goes furthest. You can also slide back down: a new codebase without tests puts you back at verification.

## Finding your bottleneck

Look at how you spent your day with agents:

- Reading diffs? Verification.
- Unblocking agents? Autonomy.
- Losing track of which agent needed you? Attention.
- Fixing merge conflicts or waiting on CI? Integration.
- Correcting the same mistake twice? Learning.

Whatever took the most time is your bottleneck. Work on that one. [Measuring the factory](../06-self-improvement/01-measuring-the-factory.md) covers doing this with numbers.
