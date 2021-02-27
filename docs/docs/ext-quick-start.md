---
id: ext-quick-start
title: Extensions
sidebar_label: Quick Start
---

With extensions, we can extend the functionality of the MiniRx Store.

## What's Included
MiniRx Store comes with following extensions:
- Redux Dev Tools Extension: Inspect state with the Redux Dev Tools
- Immutable Extension: Enforce state immutability 
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current action and updated state

## Register Extensions
Extensions can be registered by providing a configuration object to the `store`. 
The `extensions` property accepts an array of Extension instances.

For example:
```ts
import { ImmutableStateExtension, LoggerExtension } from 'mini-rx-store';

const store: Store = configureStore({
  extensions: [
    new LoggerExtension(),
    new ImmutableStateExtension()
  ]
});
```
