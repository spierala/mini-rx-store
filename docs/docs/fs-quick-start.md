---
id: fs-quick-start
title: Feature Store
sidebar_label: Quick Start
---

Feature Stores offer simple yet powerful (global) state management.

## Key Principles
- **Less Boilerplate**: With the `FeatureStore` API you can update state without writing actions and reducers
- A Feature Store **manages feature state** directly
- The state of a Feature Store **integrates into the global state**
- Feature Stores are **destroyable**

## What's Included
The MiniRx `FeatureStore` API:
- `setState()` update the feature state
- `select()` select state from the feature state object as RxJS Observable
- `effect()` run side effects like API calls and update feature state
- `undo()` easily undo setState actions (requires the UndoExtension)
- `destroy()` remove the feature state from the global state object
- `tapResponse` operator: handle the response in Feature Store `effect` consistently and with less boilerplate

:::info
**How the Feature Store works**

Feature Stores make use of Redux too: Behind the scenes a Feature Store is creating a feature reducer and a "setState" action. MiniRx dispatches that action when calling `setState()` and the corresponding feature reducer will update the feature state accordingly.
:::
