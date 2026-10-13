---
title: Principles
status: draft
---

A few principles run through the whole book. They shape how the factory works, so they come first.

## Introspect every agent session

Every agent session is a chance for the factory to get better, but only if someone looks back at it.

So introspect every session. Maybe you do it right away, while it's fresh. Maybe you do it at the end of the day, or at the end of the week, across a batch of sessions. When matters less than that it happens.

Introspection is you giving the agent feedback: what it got right, what it got wrong, and where it needed you when it shouldn't have. That feedback is only worth something if it outlasts the session. So take those insights and record them somewhere future sessions will read, so the next agent starts from what this one learned. [Where lessons live](../02-foundations/05-where-lessons-live.md) covers where to put them.

## Use the human for what only the human can do

You are good at things an agent can't do for you: deciding what you want, setting goals and intentions, and giving feedback on whether the result is right. Spend yourself there.

Everything else, the agent should do. When you catch yourself doing something by hand, ask: why can't the agent do this without me? Sometimes the answer is that it needs your judgment, and that's your job. More often, the answer is that it's missing a tool, a permission, or some context. That's a gap in the factory, and you can fix it.

## Balance agent autonomy with risk

The more an agent can do on its own, the less of you it needs, so push for as much autonomy as you can. But autonomy has a cost. An agent that can merge, deploy, or touch production can also break things there.

So responsible autonomy starts with assessing the risk. What's the worst this agent could do with this permission? How likely is that, and how quickly could you undo it? Where a mistake is cheap and easy to reverse, let the agent run. Where it's expensive or permanent, keep yourself in the loop, or add [guardrails](../04-loops/03-guardrails-and-budgets.md) until it isn't.

## Think of agents as employees or contractors

This framing comes from Nada.

Some agents are like employees. They've built up a body of knowledge about your work, and you have something like a relationship with them. They know what you've decided before, how you like things done, and what you meant last time.

Other agents are like contractors. You hand them a full job spec and expect them to deliver against it. They don't need your history, because the spec carries everything they need.

Each has its place. In the factory, we hire contractors: each slice goes out with a complete spec, and an agent delivers it. Planning is where we use employees, because working out what to build draws on everything an agent already knows about your work.
