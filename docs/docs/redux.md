---
id: redux
title: Redux
sidebar_label: Quick Start
slug: /redux
---

MiniRx Store uses the Redux pattern to make state management easy and predictable.

## Redux Pattern
The Redux Pattern is based on this 3 key principles:

-   Single Source of Truth: The Store holds the global application state.
-   State is read-only and is only changed by dispatching actions
-   Changes are made using pure functions called reducers

## What's Included
MiniRx Store (Redux) comes with these APIs:
- `feature()` add feature state reducers dynamically
- `dispatch()` dispatch an action
- `select()` select state from the global state object as RxJS Observable
- `effect()` register a side effect (e.g. an API call)
