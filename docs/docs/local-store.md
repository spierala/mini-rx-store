---
id: local-store
title: Local Store
sidebar_label: Local Store
---

MiniRx supports "local" state management with **Local Store**.
Local Store allows you to manage state **independently** of the global state object (which is used by [Store](redux) and [Feature Store](fs-quick-start    ))     .

## Key Principles of Local Store
- Local Store has the **same simple API as [Feature Store](fs-quick-start)**
- Local Store state is **independent** of the global state object
- Local Store is **destroyable**



## Use-cases
- You have to create and destroy a lot of Stores at the same time: Local Stores will show better performance 
(while creating/destroying Feature Stores has more overhead).
- Very frequent state changes could lead to performance issues when using `Store` or `FeatureStore` (both update the global state object using actions and reducers, which means more overhead).
- State is local to a component, and you do not want to bother the global state object with that state.

:::info
Are you doubting between Feature Store and Local Store?

Then use Feature Store!

Feature Store state becomes part of the global state object.
That object can be inspected with Redux DevTools for a better debugging experience.
Feature Stores automatically use the Store extensions (Local Stores have a dedicated extension setup: see Local Store ["Extensions"](#extensions)). 

If you encounter the use-cases from above, it will be easy to refactor from `FeatureStore` to `LocalStore`.
:::info

## What's Included
The MiniRx `LocalStore` API:
- `setState()` update the state
- `select()` select state as RxJS Observable
- `effect()` run side effects like API calls and update state
- `undo()` easily undo setState actions (requires the UndoExtension)
- `destroy()` clean up all internal Observable subscriptions (e.g. from effects)
- `tapResponse` operator: handle the response in Local Store `effect` consistently and with less boilerplate

Since the API of Local Store is identical to Feature Store, please refer to the 
[Feature Store](fs-quick-start) documentation for more details. 

## Create a Local Store

There are 2 Options to create a new Local Store.

### Option 1: Extend LocalStore

```typescript
import { Observable } from 'rxjs';
import { ComponentStore } from 'mini-rx-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

export class CounterStore extends ComponentStore<CounterState> {
  count$: Observable<number> = this.select((state) => state.count);

  constructor() {
    super(initialState);
  }

  increment() {
    this.setState({ count: this.state.count + 1 }, 'increment');
  }

  decrement() {
    this.setState({ count: this.state.count - 1 }, 'decrement');
  }
}
```

### Option 2: Functional creation method

We can create a Local Store with `createComponentStore`.

```ts
import { ComponentStore, createComponentStore } from 'mini-rx-store';

const counterCs: ComponentStore<CounterState> = createComponentStore<CounterState>(initialState);
```


## Extensions
You can use most of the [MiniRx extensions](ext-quick-start) with the Local Store.

Extensions with Local Store support:

- Immutable Extension: Enforce state immutability
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current "setState" action and updated state

It's possible to configure the Local Store extensions globally or individually for each Local Store instance.

### Global setup

```typescript
import {
  configureComponentStores,
} from 'mini-rx-store';

configureComponentStores({
  extensions: [new ImmutableStateExtension()]
});
```
Now every Local Store instance will have the ImmutableStateExtension. 

### Local setup
```typescript
import { ComponentStore, LoggerExtension } from 'mini-rx-store';

export class CounterStore extends ComponentStore<CounterState> {
  constructor() {
    super(initialState, {
      extensions: [
        new LoggerExtension(),
      ]
    });
  }
}
```

Every `CounterStore` instance will have the LoggerExtension **and** the 
ImmutableStateExtension from the global `configureComponentStores` setup: 
"local" extensions are merged with the extensions from `configureComponentStores`.

:::info
It makes sense to add the ImmutableStateExtension to `configureComponentStores`.
Like that every Local Store can benefit from immutable state.

The LoggerExtension can be added to individual Local Stores for debugging purposes (["Local setup"](#local-setup)).

Regarding the `undo` API: add the UndoExtension to the Local Stores which need the undo functionality (["Local setup"](#local-setup)). 
:::info

