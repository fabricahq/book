---
title: The environment
status: planned
---

## What this section will cover

- Two layers of environment: the one you work in, and the one each agent works in
- Your agent canvas: where you dispatch agents, follow their progress, and review their work
- Each agent's workspace, defined within that canvas: its own copy of the code, terminal, tools, running services, and credentials
- Kinds of agent workspace, from least to most isolated: your machine, a worktree, a container sandbox, a remote workspace
- Choosing a workspace for a task: what the agent needs, and what it could break
- Permissions and secrets in each workspace

## Where the agent runs

- Local vs. cloud
- Local
  - Pros
    - Your agent can access your local environment, which you fully control
    - Nothing to set up
    - No billing-related usage limits
  - Cons
    - You eventually run out of local resources (CPU, memory)
    - Your agents sleep when your laptop closes
- Cloud
  - Pros
    - Scales to infinity
  - Cons
    - More work to set up your cloud environment

### Cloud Agent options

- Claude cloud agents?
- Cursor cloud agents?
