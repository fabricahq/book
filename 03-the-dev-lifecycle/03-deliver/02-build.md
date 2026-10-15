---
title: Build
status: planned
---

## Building efficiently

- The naive way to build is just give your agent a prompt and let it rip
- Let's make one improvement at a time to unleash more leverage
  1. Tell the agent how to build
     - Skills
     - Code Rules
  2. Strategically time human feedback
     - Build first, then show the UX for human review
  3. Create a feedback loop by enabling the agent to *verify* its work.
     - Correctness
     - Viability (does it basically do what it's supposed to)
     - Maintainability (architecture, tests)
     - Performance
     - Usability
     - Security
     - Observability
     - Accessibility

Of these, verification is the biggest unlock because it means the agent can do more without human oversight. You the human want to be reviewing deliverables, not validating correctness. 

## Building well

- There's Code Rules + Rulemart, of course.
- 

## Doing verification well

per https://x.com/poteto/status/2094457600259842065 (@poteto):
- Verification is critical 
  - Create-verification skill (https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)
  - Maintain-verification skill ()
- This skill verifies:
  - correctness: Does it actually work
  - performance: Is it consuming an excessive amount of memory
  - viability
  - "you ideally want to interact with your app, debug it, take perf traces, and any other debugging and development tooling that you might typically use if you were developing the app by hand."
    - For example, https://chromedevtools.github.io/devtools-protocol/
- Important: Choose a tech stack that supports verification
- "I recommend spending time here making this CLI good and error free before doing anything more advanced."
- Writing agent-friendly CLIs
  - the API is easy to compose - think John Ousterhout's deep modules philosophy
  - any command with potentially destructive side effects should have a --dry-run option
  - make use of subcommands to gradually disclose functionality rather than all at once
  - error messages should be very descriptive and tell the agent what it should do instead
  - rich --help text
  - outputs returned in machine readable form (eg JSON)
- Agents need to know about your full app, so you need a feature map like [this one](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md).
  - Create this with create-verification-skill
  - Be sure to maintain it at least once a day with maintain-verification-skill

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