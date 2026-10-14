---
title: Design
status: planned
---

## What this section will cover

- Choosing the tech stack and the high-level architecture
- How what the prototype taught you shapes the design
- When to skip it, such as when the work fits an existing system

## Get in sync with your agent

An agent can only build what you want once it understands what you want, and that doesn't happen on its own. In his [interview on The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Matt Pocock makes the case that getting the human and the agent in sync takes a deliberate effort.

The trick is to flip who asks the questions. Instead of writing a long prompt and hoping it covers everything, let the agent interview you:

- [`/grill-me`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), from Matt Pocock, has the agent question you relentlessly about a plan until you both see it the same way. Matt credits the idea of an agent interviewing its user to Thariq Shihipar at Anthropic.
- [`/explore-unknowns`](https://github.com/dzhng/skills/blob/main/skills/engineering/explore-unknowns/SKILL.md), from [David Zhang](https://github.com/dzhng), walks you through what you know, what you don't, and what neither of you has thought of yet, until the unknowns are mapped.

Other skills do the same job, and the pattern matters more than any one of them: have the agent ask before it builds. Do it before you settle the design, so the design starts from a shared picture of what you want.
