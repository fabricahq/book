---
title: Build
status: planned
---

## Building efficiently

- The naive way to build is just give your agent a prompt and let it rip
- Let's make one improvement at a time to unleash more leverage
  1. Tell the agent how to build
     - Skills
     - Rules
  2. Strategically time human feedback
     - Build first, then show the UX for human review
  3. Create a feedback loop by enabling the agent to *verify* its work. See [Verify](03-verify.md).

Of these, verification is the biggest unlock because it means the agent can do more without human oversight. You the human want to be reviewing deliverables, not validating correctness. 

## Building well

- There's Syllabus (formerly Code Rules) + Rulemart, of course.
  - Define the skills and rules that guide how your agent builds

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

- See setting up your agent environment in I think 2.x foundations