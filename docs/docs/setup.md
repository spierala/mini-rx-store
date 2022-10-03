---
id: setup
title: Setup
---

MiniRx Store requires only a minimum of configuration to get started.

## No Setup
Pass an empty configuration to `configureStore` to get hold of the `Store` instance:
```ts
import { configureStore, Store } from 'mini-rx-store';

const store: Store = configureStore({});
```
With the `Store` instance we can already add reducers (dynamically), select state, dispatch actions and create effects.

## Redux Setup
Read ["Redux" Store Setup](redux-setup) to see the Redux related configuration options.

## Extensions
We can add extensions to the Store config to add additional functionality.

Currently, these extensions are included in MiniRx:
- Redux DevTools Extension: Inspect state with the Redux DevTools
- Immutable Extension: Enforce state immutability
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current action and updated state

Example: Add the LoggerExtension
```ts
import { LoggerExtension } from 'mini-rx-store';

const store: Store = configureStore({
  extensions: [new LoggerExtension()]
});
```
