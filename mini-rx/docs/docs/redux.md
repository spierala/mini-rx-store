---
id: redux
title: Redux
sidebar_label: Quick Start
slug: /redux
---

MiniRx Store uses the Redux pattern to make state management easy and predictable.

## Redux Pattern
The Redux Pattern is based on this 3 key principles:

-   Single source of truth: The **store** holds the global application state
-   State is read-only and is only changed by dispatching **actions**
-   Changes are made using pure functions called **reducers**

## What's Included
The MiniRx Redux Store comes with these APIs:
- `feature()` add feature state reducers dynamically
- `dispatch()` dispatch an action
- `select()` select state from the global state object as RxJS Observable
- `effect()` register a side effect (e.g. to trigger an API call and handle its result)
