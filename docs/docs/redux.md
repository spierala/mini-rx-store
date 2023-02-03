---
id: redux
title: Store (Redux API)
sidebar_label: Quick Start
slug: /redux
---

MiniRx Store offers the **Redux API** for advanced state management.

## Redux Pattern
The Redux Pattern is based on these key principles:

-   Single source of truth: The **store** holds the global application state
-   State is read-only and is only changed by dispatching **actions**
-   Changes are made using pure functions called **reducers**

## What's Included
The MiniRx Redux Store comes with these APIs:
- `configureStore()` setup reducers and extensions and return the Store instance
- `feature()` add feature state reducers dynamically
- `dispatch()` dispatch an action
- `select()` select state from the global state object as RxJS Observable
- `createFeatureStateSelector` and `createSelector` to create memoized selectors
- `effect()` register an effect to isolate and handle side effects
- `mapResponse()` handle side effect response in effects
