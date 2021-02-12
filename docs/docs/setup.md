---
id: setup
title: Setup
---

MiniRx Store requires only a minimum of configuration to get started.

## No Setup
The most basic setup is no setup... we can pass an empty configuration to `configureStore`
and get hold of the Store instance.

```ts
import { configureStore, Store } from 'mini-rx-store';

const store: Store = configureStore({});
```
With the `store` instance we can already add reducers (dynamically), select state, dispatch actions and create Effects.

## Redux Setup
Read ["Redux" Store Setup](redux-setup) to see the Redux related configuration options.

## Extensions
We can add extensions to the Store config to add additional functionality.

Currently, these extensions are included in MiniRx:
- Redux Dev Tools Extension: Inspect State with the Redux Dev Tools
- Immutable Extension: Enforce immutability
- Undo Extension: Undo dispatched Actions
- Logger Extension: console.log the current action and updated state

Example: Add the LoggerExtension
```ts
import { LoggerExtension } from 'mini-rx-store';

const store: Store = configureStore({
    extensions: [new LoggerExtension()]
});
```
