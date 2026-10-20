---
title: Validate
status: planned
---

## What this section will cover

- Like [Verify](03-verify.md), Validate checks whether the implementation is correct; the difference is that something other than the implementing agent does the checking
- Who validates: you, a fresh reviewer agent without the builder's context, or both
- Product validation: does it do what you wanted
- Technical validation: is it built well, judged from the evidence verification produced rather than by reading every line
- How much structural verification you need depends on how thorough the [plan](01-plan.md) was
- Decisions that departed from the [design tree](../../90-toolbox/index.md#design-tree-visualizer): new things come up during implementation, so review the biggies, such as layering or seams, schemas, and so on
- A [layer diagram](01-plan.md#layer-diagrams) of the change makes those biggies easy to spot in a PR review
