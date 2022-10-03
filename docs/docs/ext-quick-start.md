---
id: ext-quick-start
title: Extensions
sidebar_label: Quick Start
---

With extensions, we can extend the functionality of the MiniRx Store.

## What's Included
MiniRx Store comes with following extensions:
- Redux DevTools Extension: Inspect global state with the Redux DevTools
- Immutable Extension: Enforce state immutability 
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current action and updated state

## Register Extensions
Extensions can be registered by passing a configuration object to `configureStore`. 
The `extensions` property accepts an array of Extension instances.

For example:
```ts
import { 
  ImmutableStateExtension, 
  LoggerExtension, 
  configureStore 
} from 'mini-rx-store';

const store: Store = configureStore({
  extensions: [
    new LoggerExtension(),
    new ImmutableStateExtension()
  ]
});
```
