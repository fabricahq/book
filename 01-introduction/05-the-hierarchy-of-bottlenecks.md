---
title: The hierarchy of bottlenecks
status: planned
---

## What this section will cover

- At any moment, one bottleneck limits what your factory produces, and improving anything else is wasted effort. Relieve it, and the bottleneck moves to the next one. This is Eliyahu Goldratt's Theory of Constraints, from _The Goal_, applied to software factories.
- The hierarchy, in the order you usually meet it:
  1. Verification: can the work be confirmed right without you reading it? Poteto argues this comes first.
  2. Autonomy: how long can one agent run before it needs you?
  3. Attention: how many agents can you direct and review at once?
  4. Integration: how fast does parallel work land, through merge conflicts, CI, the review queue, and deploys?
  5. Learning: how fast does the factory stop repeating its mistakes?
- Intent sits beneath the hierarchy: deciding what you want is the human's permanent job, and the goal is for it to become the only bottleneck left
- Why the order matters: more agents only add review work until verification is cheap, and many agents that each need you constantly are worse than one that doesn't
- The order isn't strict: a new codebase or a new model can push you back down a level
- How to find your current bottleneck, and why to work only on that one
