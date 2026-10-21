---
title: Toolbox
appendix: true
status: planned
---

## What this appendix will cover

- Current recommended tools, which change often
- Agent canvases, such as Orca, Conductor, Omnigent, Amp, Claude Code, Codex, and Grok Build
- Orchestrators, such as [FirstMate](https://github.com/kunchenguid/firstmate) by Kun Chen
- Agent workspaces, such as [OpenHands](https://www.openhands.dev/)

## Tools I need

### Test visualizer

- A visual way to quickly understand all the tests an agent proposes
- For property-based tests, show me the invariants
- For end-to-end tests, show me the spec
- For standard unit tests, just show me the test cases
- All of it nicely visualized

### Design tree visualizer

- Matt Pocock's [Grill Me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) skill is awesome
- But you don't know how many total questions there are, and it's hard to get a summary of everything that was asked
- It does generate a spec, so you could review that
- But it might be more useful to have a visual tree where the most consequential decisions are seen at the top
- Then you can keep expanding it to get a feel for whether those are worth reviewing, or whether just the big stuff at the top is good enough

### Plan conformance checker

- Takes the plan I want to review, with my schemas, my system vocabulary, and my data flows
- As part of the review and the pull request, checks the implementation against them to make sure they're all in line
- If they're not, and the agent wants to depart from them, it raises the reason for doing so
- Or maybe that's actually part of [validation](../03-the-dev-lifecycle/03-deliver/04-validate.md)

### Layer diff viewer

- Knows the overall system architecture, and its layers
- Evaluates this particular pull request or change against it
- Essentially shows me the new layers and how they relate to the existing ones, like a [layer diagram](../03-the-dev-lifecycle/03-deliver/01-plan.md#layer-diagrams) for the change

### PR design explainer

- Helps me understand the design of a PR
- I don't care about the code. I care about the design, and the approach
- Focuses on the fastest possible way for me, the human, to understand what was built
- Lets me review the design and architecture, schemas, concepts, and names
