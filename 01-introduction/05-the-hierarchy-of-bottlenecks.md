---
title: The hierarchy of bottlenecks
status: draft
---

In 1984, Eliyahu Goldratt published [The Goal](https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951), a novel about turning around a failing physical factory to become wildly profitable. Fast forward 40 years and the book is as relevant as ever for software factories!

The key insight is that in any process, one constraint sets the pace for the entire process. This is known as the bottleneck, and it turns out that improving the performance of any step other than the bottleneck is a waste of time.

## Let's take a hike

The book illustrates the concept with a simple metaphor. Alex, the lead character responsible for turning the plant around, volunteers to lead his son's boy scout troop on a hike. He decides to line the boys up single file (one behind the other; no one walking next to each other), and off they go.

Before long, the boys are getting further and further away from each other. The fastest kids at the front keep pulling ahead, large gaps open up between them and scouts behind them, and the troop as a whole keeps falling behind schedule.

The problem is Herbie, the slowest hiker. The scouts in front of Herbie move at a fine pace. But the scouts behind Herbie have been instructed not to pass him, and so everyone is just waiting for him to move faster.

As a result, the entire troop can't reach their destination until Herbie does. Every minute the kids at the front gain from moving fast doesn't matter in the end. Once they reach their milestone, they just stop and wait for Herbie.

So Alex changes the plan. He moves Herbie to the front of the line, where no one can outpace him. That takes care of the gaps problem. Then he opens Herbie's pack, finds it full of heavy things, and splits them among the other boys. Now Herbie speeds up, and so does the whole troop.

## Only the bottleneck matters

Goldratt called this the Theory of Constraints. In any system, one constraint sets the pace for the whole. Speed up the constraint, and everything speeds up. Speed up anything else, and nothing changes, just like the kids at the front who reached a milestone early and then had to wait around for Herbie.

A follow-on insight is that once you relieve the bottleneck, a new one pops up!

## Software factories have bottlenecks, too

A software factory works the same way. At any moment, one part of the process limits how much useful work it can produce. 

If you produce and approve a prototype in 15 minutes, but then spend days on code review, you can see pretty quickly that making the prototype phase go even faster won't make much difference. But fixing that code review step will make a big difference!

## The hierarchy

In my experience, there is a common "hierarchy" of bottlenecks that individuals and teams go through on the way to building a software factory. 

```mermaid
flowchart TD
  accTitle: The hierarchy of bottlenecks
  accDescr: It starts with your intent to ship a deliverable. Then come seven bottlenecks, met in this order: verification, review, build autonomy, integration, session capacity, cognitive load, and learning.
  intent(["<b>Intent</b><br/>You intend to ship a deliverable."])
  verification("<b>Verification</b><br/>Can the agent check its own work?")
  review("<b>Review</b><br/>Is the work what you wanted?")
  buildAutonomy("<b>Build autonomy</b><br/>How long can one agent build without your input?")
  integration("<b>Integration</b><br/>How fast can finished work land?")
  sessionCapacity("<b>Session capacity</b><br/>Can your machines and budget run more sessions?")
  cognitiveLoad("<b>Cognitive load</b><br/>How many agents can you manage at once?")
  learning("<b>Learning</b><br/>How well does the factory learn from past mistakes?")
  intent -.- verification --> review --> buildAutonomy --> integration --> sessionCapacity --> cognitiveLoad --> learning
```

### Verification

Lauren Tan (better known as the venerable `@poteto` on X) makes the case that [verification is the first bottleneck](https://x.com/poteto/status/2094457600259842065).

Did the agent do the work right? Until the agent can check its own work, you're the one who finds out it's broken, by running it yourself. Every agent you add just adds to that load.

Once the agent can run a check, read the result, and fix what failed, it hands you work that already works. This is why `@poteto` emphasizes verification so much. See [Verify](../03-the-dev-lifecycle/03-deliver/03-verify.md).

### Review

With verification handled, the work runs. But is it what you wanted? Now you're the one reading diffs, to check the design, the layers, the schemas, and the names.

We need _confidence_ about a work product before we can accept it. That confidence relates to:

- Simplicity
- Correctness
- Usability
- Observability
- Security
- Maintainability

And possibly more. We can establish confidence by having agents assess the work product along these dimensions, or we can do the review ourselves.

Some teams assess the risk level of their work products and only human-review what they deem to be "high risk."

But in the end, until reviewing the work is cheap, every agent you add just adds to your review load. See [Validate](../03-the-dev-lifecycle/03-deliver/04-validate.md).

### Build autonomy

With review handled, you can trust your agent's work. The next bottleneck is how long the agent can build before it stops to ask you for something it shouldn't need you for, such as:

- The right environment, such as a dev server, database, or browser it can use
- Access to secrets
- Permission to run a command
- A missing tool
- A decision it could have made itself

See [Build](../03-the-dev-lifecycle/03-deliver/02-build.md) and [The environment](../02-foundations/03-the-environment.md).

### Integration

With one agent building on its own, how fast does its work land? Each pull request still has to pass CI, merge cleanly, and deploy. Slow or flaky CI, merge conflicts, and manual deploys all hold finished work back. See [Merge](../03-the-dev-lifecycle/03-deliver/05-merge.md) and [Deploy](../03-the-dev-lifecycle/03-deliver/06-deploy.md).

If the agent has to wait on CI to find out whether its work passes, that's a verification problem instead. Give it a fast loop it can run itself.

### Session capacity

With work landing quickly, you can run more agent sessions in parallel.

Do your machines and your budget have room for more sessions? Each session with its own dev server, database, and browser uses real CPU and memory, so a laptop fills up after a few, and every session stops when the laptop sleeps. Usage limits work the same way: hit your plan's token or rate limit, and your sessions stop just as surely. See [The environment](../02-foundations/03-the-environment.md).

### Cognitive load

With room to run them, you'll soon have more agents going than you can easily follow.

How many agents can you manage at once? The limit is you again: which agent needs you, and what was it doing? See [Orchestration](../05-orchestration/).

### Learning

How fast does the factory stop repeating its mistakes? If each session makes the last one's mistake, you pay for it every time. See [Self-improvement](../06-self-improvement/).

### Intent

Relieve the other seven, and what's left is deciding what you want. That's [the human's job](04-principles.md#use-the-human-for-what-only-the-human-can-do), and it never goes away. The point of working through the hierarchy is to make intent the only bottleneck left.

## Why the order matters

Without verification, ten agents means ten times the testing by hand. Without cheap review, it means ten times the reading. Without build autonomy, it means ten agents interrupting you. Each level pays off only once the ones before it are in place.

Real work isn't this tidy, and you'll hit a merge conflict on day one. But only one bottleneck limits you right now, and that's where your time goes furthest. You can also slide back: a new codebase without tests puts you back at verification.

## Finding your bottleneck

Look at how you spent your day with agents:

- Finding broken work by running it yourself? Verification.
- Reading diffs? Review.
- Unblocking agents? Build autonomy.
- Fixing merge conflicts or waiting on CI? Integration.
- Watching your laptop slow to a crawl, or hitting usage limits? Session capacity.
- Losing track of which agent needed you? Cognitive load.
- Correcting the same mistake twice? Learning.

Whatever took the most time is your bottleneck. Work on that one. [Measuring the factory](../06-self-improvement/01-measuring-the-factory.md) covers doing this with numbers.
