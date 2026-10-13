---
title: Orchestration patterns
status: planned
---

## What this section will cover

- The canvas and the orchestrator are separate choices: the [canvas](../02-foundations/03-the-environment.md) is where you see your agents, and the orchestrator decides what runs next and supervises it
- Without an orchestrator, you are the orchestrator, working by hand in your canvas
- Where an orchestrator comes from: built into your harness, built into your canvas, or your own, brought into the canvas you prefer (FirstMate as an example)
- The problems every orchestrator has to solve:
  - Dispatch: how it starts an agent on a piece of work
  - Status: how it tells you what each agent is doing
  - Attention: which agents are waiting on you, and which are still working
  - Supervision: how it keeps every agent performing well, so none of them loses the plot
- Ways to run agents in parallel between your review checkpoints: parallel worktrees, supervisor/worker, chief of staff
- Running more agents than your machine can hold, in remote workspaces (see [The environment](../02-foundations/03-the-environment.md))
