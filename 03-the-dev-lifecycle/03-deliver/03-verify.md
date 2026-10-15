---
title: Verify
status: draft
---

Your agent says the feature works. Does it?

Without verification, you find out by checking yourself, which doesn't scale past one agent. That's why [verification is the first bottleneck](../../01-introduction/05-the-hierarchy-of-bottlenecks.md#verification).

When the agent can check its own work, it can loop for much longer without your input: run a check, read the result, fix what failed, repeat. It comes back to you only when the work passes, not every time something breaks.

Verify and [Validate](04-validate.md) both check whether the implementation is correct. The difference is who checks. In Verify, the implementing agent checks itself. In Validate, something other than that agent checks it, such as you or a fresh reviewer agent.

Most of these techniques come from Addy Osmani's [Agentic verification](https://addyo.substack.com/p/agentic-verification) and Lauren Tan's (`@poteto`) [The Complete Guide to pstack, Part 1](https://x.com/poteto/status/2094457600259842065).

## End-to-end tests

End-to-end tests drive the app the way a user does, so they're hard to fool. When an agent writes code and unit tests together, both can share the same misunderstanding and pass anyway.

Keep a small set covering the flows that matter, since these tests are slow and flaky. Make failures diagnostic, with screenshots, traces, and the failing step.

## Property-based tests

An agent tends to pick test examples that match its own logic. Property-based tests instead state a rule that must always hold, and a tool such as [fast-check](https://fast-check.dev/), [Hypothesis](https://hypothesis.readthedocs.io/), or [proptest](https://github.com/proptest-rs/proptest) generates thousands of inputs to break it, then shrinks any failure to its smallest case.

Common properties: encoding then decoding returns the original, a balance never goes negative, doing something twice equals doing it once, and a fast version matches a simple one. Start with a small pure function, and save each failure as a regular test.

## Keep the loop fast and deterministic

A flaky test teaches the agent to rerun instead of fix. A slow one makes it batch changes, so it can't tell which one broke things. Aim for a core loop of about a second, seed randomness and freeze clocks, and quarantine flaky tests on sight. Save end-to-end tests for before merge.

## Let the agent drive your app

Tan argues the agent should be able to run, use, and debug your app as you would, for example through the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). So choose a stack that allows it, and give the agent:

- A verification skill that says how to launch, drive, and observe the app, such as one written by [create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)
- A [feature map](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md) of what your app does and how to reach it, refreshed daily
- An agent-friendly CLI, with JSON output, rich `--help`, `--dry-run` on destructive commands, and errors that say what to do instead

## Check the checks

An agent can write tests that pass and prove nothing. Have it ask of each test: would this fail if the code were plausibly wrong? A check that needs someone without the builder's assumptions belongs in [Validate](04-validate.md).
