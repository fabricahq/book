---
title: Verify
status: draft
---

Your agent just finished building. It says the feature works. Does it?

Without verification, the only way to know is to check yourself: read the diff, start the app, click around, and report back what broke. That loop is slow, and it doesn't scale past one agent. It's why [verification is the first bottleneck](../../01-introduction/05-the-hierarchy-of-bottlenecks.md#verification) in the hierarchy.

Verify is where the agent checks its own work before you ever see it. It runs a check, reads the result, fixes what failed, and runs the check again. By the time the work reaches you, it comes with evidence that it works, and your job shifts from reading every line to reviewing that evidence.

Verify answers "did the agent build it right?" [Validate](04-validate.md) answers a different question: "did it build the right thing?" Only you can answer the second one, so the more of the first the agent handles, the more of your attention goes where it matters.

Addy Osmani's [Agentic verification](https://addyo.substack.com/p/agentic-verification) is the source for most of the techniques on this page, and it's well worth reading in full. His core claim is that a better feedback loop does more for the quality of agent-written code than a slightly better model.

## Write the check before the code

Before you ask the agent to build something, decide what "done" looks like as something a machine can check: a user flow that has to work end to end, a rule that must always hold, or a match against how the old system behaves. Then "implement this feature" becomes "make this check pass," which is a target the agent can actually hit.

Two habits help here:

- **Ask the agent to restate its success criteria before it starts.** If its idea of done differs from yours, you find out before it writes the code, not after.
- **Keep the check out of the agent's reach.** An agent that's allowed to change the code and the check can make the check pass by weakening it. A commenter on Osmani's post suggests giving the agent permission to fix the implementation, but not to change the acceptance criteria, so it can't move the goalposts to get to green.

## End-to-end tests

End-to-end tests drive the app the way a user does: sign up, add something to the cart, check out, see the confirmation. They don't care how the code is structured inside. The flow either works or it doesn't.

That's exactly what makes them a good check on an agent. When an agent writes code and its unit tests together, both can share the same misunderstanding, and the tests pass anyway. Mocks make it worse, since a mock only behaves the way the agent assumed the real thing does. An end-to-end test is much harder to fool.

A few things make end-to-end tests work well for agents:

- **Cover the flows that matter, not everything.** End-to-end tests are slower and flakier than unit tests, so keep a small set of high-value ones.
- **Make failures diagnostic.** "Timeout after 30s" tells the agent nothing. A screenshot, a trace, and the step that failed tell it where to look.
- **Run them everywhere.** The same tests should run on the agent's machine and against a deployed environment.

## Property-based tests

Most tests check examples: given this input, expect that output. The trouble is that an agent tends to pick examples that match its own logic, so the tests confirm what the code already does rather than what it should do.

Property-based tests flip that around. You state a rule that must always hold, and a tool generates thousands of inputs trying to break it. When it finds one, it shrinks the input to the smallest case that still fails, so the agent gets a tidy bug report instead of a wall of random data. Tools include [fast-check](https://fast-check.dev/) for JavaScript and TypeScript, [Hypothesis](https://hypothesis.readthedocs.io/) for Python, and [proptest](https://github.com/proptest-rs/proptest) for Rust.

Some properties that show up again and again:

- **Round trip:** encoding then decoding gives you back what you started with.
- **Invariants:** sorting keeps every element, a balance never goes negative, money in equals money out.
- **Idempotency:** doing something twice has the same effect as doing it once.
- **Equivalence:** a fast, clever version gives the same answers as a slow, obviously correct one.

To get started, pick a small pure function, such as a parser, a formatter, or a pricing calculation. Write the property in plain English first, then turn it into code. When the tool finds a failure, save the shrunken input as a regular test, so the bug can't quietly come back. And ask the agent to propose properties, too. It's often good at finding rules you hadn't thought to write down.

## Differential tests

When an agent rewrites or migrates an existing system, the old system is the best check you have. Run the old and new versions side by side on the same inputs, whether generated, replayed from real traffic, or both, and treat every difference as either a bug or an intended change you write down. That catches the undocumented behavior users depend on, which a fresh test suite never would. Once the differences are gone, retire the old system rather than running both forever.

## Keep the loop fast and trustworthy

A slow or flaky check teaches the agent bad habits. If a test fails at random, the agent learns to rerun it instead of fixing anything. If the suite takes ten minutes, the agent batches up changes, and when something breaks, it can't tell which change did it.

So treat your test setup as part of the product:

- Aim for a core loop that runs in about a second.
- Make it deterministic: seed randomness, freeze clocks, control the network, and isolate state.
- Quarantine a flaky test the moment you see one, then fix or delete it.
- Keep output short and focused on what failed.
- Run the fast loop on every change, and save the heavier end-to-end and differential suites for before the work merges.

## Let the agent drive your app

Tests only go so far. Lauren Tan (`@poteto`) [makes the case](https://x.com/poteto/status/2094457600259842065) that the agent should be able to do everything you'd do when developing by hand: run the app, interact with it, debug it, and take performance traces. For a web app, that means something like the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). For a mobile app, a simulator. For a service, an API harness.

This has a few consequences:

- **Choose a tech stack that supports verification.** If an agent can't run and observe your app, it can't check its own work.
- **Give the agent a verification skill.** A skill that tells the agent how to launch, drive, and observe the app. The [create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md) skill Tan points to writes one for your project, and a companion skill keeps it up to date.
- **Keep a feature map.** The agent needs to know your whole app, not just the files in front of it. A feature map lists each feature from the user's point of view: how to reach it, what to expect, and what tends to go wrong. See Tan's [example feature map](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md). It goes stale quickly, so refresh it often, at least once a day on an active project.

If the agent drives your app through a CLI, Tan's advice is to make that CLI good and error-free before doing anything more advanced. A CLI that's easy for an agent to use:

- Composes simply, with a small interface hiding a lot of work, in the spirit of John Ousterhout's deep modules
- Offers a `--dry-run` option on any command with destructive side effects
- Uses subcommands to reveal what it can do a little at a time, rather than all at once
- Has rich `--help` text
- Writes error messages that say what went wrong and what to do instead
- Returns output in a machine-readable form, such as JSON

## Check the checks

An agent can write tests that pass and still prove nothing. So review the checks themselves, especially early on: would this test fail if the code were plausibly wrong? A fresh agent, with none of the builder's context, is a good reviewer here, since it doesn't share the builder's assumptions.

## What to verify

Correctness is where most people start, but it isn't the only kind of confidence you need. Depending on the work, the agent might also check:

- Viability: does it basically do what it's supposed to?
- Maintainability: is the architecture sound, and is it tested?
- Performance: is it fast enough, and is it using too much memory?
- Usability
- Security
- Observability
- Accessibility

Each one you hand to the agent is one less thing you have to check by hand.
