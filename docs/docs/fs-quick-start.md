---
id: fs-quick-start
title: Feature Store
sidebar_label: Quick Start
---

If a feature in your application requires only simple state management, then you can fall back to a simplified API:
With the FeatureStore API you can update state without writing actions and reducers.

The state of a FeatureStore becomes also part of the global state. 

## What's Included
MiniRx FeatureStore comes with these APIs:
-   `setState()` update the feature state
-   `select()` read feature state
-   `effect()` run side effects like API calls and update feature state
-   `undo()` easily undo setState actions (requires UndoExtension)
