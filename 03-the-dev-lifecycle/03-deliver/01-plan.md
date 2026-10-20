---
title: Plan
status: planned
---

## What this section will cover

- Planning one slice before an agent builds it
- The more you settle in the plan, the less structural verification you need later: a plan that pins down the architecture, the boundaries, and the approach leaves less for review to catch
- A common failure mode: getting impatient and telling the agent to "just get started already," which moves the hard thinking into verification, where it costs more
- Capture a planning checklist as a [Code Rules](https://code-rules.fabricahq.com) rule, so every plan gets checked against it, whether you run the check or the agent checks its own plan
- Start a review checklist of what's "must review" and what's "nice to review"
  - Must review: layers, major data flows, schemas, and system vocabulary
  - Nice to review: function interfaces

## Layer diagrams

- Layer diagrams are super useful for planning and for PR reviews
- They show each layer, what it's for, and which layers it may depend on, so you can see at a glance whether a plan or a change respects the architecture
- For a PR, highlight the layers the change touches, such as the transport layer here

```mermaid
flowchart TB
  accTitle: Layers of a typical service
  accDescr: Entry points wire up a bootstrap layer, which builds an app facade. The transport layer calls the facade, which forwards each operation to a bounded context's use cases. Use cases rely on a store interface, which an SQL adapter implements, and the store depends on the domain, which imports nothing above it. The transport layer is highlighted as the layer a change touches.
  entry["<b>Entry points</b><br/>API server, desktop app"]
  subgraph platform["Platform"]
    bootstrap["<b>Bootstrap</b><br/>opens the database, builds the facade"]
    facade["<b>App facade</b><br/>one entry point for every operation"]
    transport["<b>Transport</b><br/>HTTP and RPC handlers<br/><i>changed in this PR</i>"]
    root["<b>Composition root</b><br/>connection pool, adapters"]
  end
  subgraph context["A bounded context"]
    usecases["<b>Use cases</b><br/>validate, authorize, orchestrate"]
    store["<b>Store</b><br/>the interface"]
    adapter["<b>Store adapter</b><br/>the SQL"]
    domain["<b>Domain</b><br/>types and invariants; imports nothing above"]
  end
  entry -->|wires| bootstrap
  bootstrap -->|builds| facade
  bootstrap --> root
  transport -->|calls| facade
  facade -->|forwards| usecases
  root -->|constructs| adapter
  usecases -->|uses| store
  adapter -.->|implements| store
  store --> domain
  classDef changed stroke-width:3px
  class transport changed
```
