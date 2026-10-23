---
title: Opportunity patterns
status: draft
---

Some problems keep coming up, in different codebases and even in different domains. I call these _opportunity patterns_: something you notice happening in your factory, and a known way to fix it. Each one is a chance to make every future agent session cheaper or better.

Each pattern below describes what happened, how to spot it, and how to fix it.

## Agents keep rediscovering the same thing

### What happened

Lauren Tan (`@poteto`) noticed that while her agent ran end-to-end tests, it kept reimplementing the same approach to navigating her app. She saved a lot of time by building one official CLI for navigating the app, and then pointing every agent to it. See her [guide to pstack](https://x.com/poteto/status/2094457600259842065).

My wife ran into the same thing in a different domain. Her agent needed to build against an API whose docs were behind a gate, so it rediscovered the API on its own. Every new agent session started from scratch and rediscovered it again, which got expensive. She fixed it by building her own parallel API with canonical docs, so every agent could work from those instead.

### How to spot it

- Different agent sessions do the same exploratory work to answer the same question
- You keep paying, in time and tokens, for discovery an earlier session already did

### How to fix it

Do the discovery once, and turn what you learn into one canonical tool or reference, such as a CLI, a set of docs, or a stand-in API. Then point every agent to it, for example from a skill or a rules file. For a CLI, see [Let the agent drive your app](../03-the-dev-lifecycle/03-deliver/03-verify.md#let-the-agent-drive-your-app).

Ideally, the factory would notice this pattern on its own. That's a tool I'd like to have; see the [opportunity pattern detector](../90-toolbox/index.md#opportunity-pattern-detector).
