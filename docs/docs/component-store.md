---
id: component-store
title: Component Store
sidebar_label: Component Store
---

MiniRx supports "local" state management with **Component Store**.
Component Store allows you to manage state **independently** of the global state object (which is used by [Store](redux) and [Feature Store](fs-quick-start))     .

## Key Principles of Component Store
- Component Store has the **same simple API as [Feature Store](fs-quick-start)**
- Component Store state is **independent** of the global state object
- Component Store is **destroyable**

## Use-cases
- State is local to a component, and you do not want to bother the global state object with that state.
- You have to create and destroy a lot of Stores at the same time: Component Stores are created and destroyed in a performant way.
- Very frequent state changes could lead to performance issues when using `Store` or `FeatureStore` 
(both update the global state object using actions and reducers, which means more overhead).

:::info
Are you doubting between Feature Store and Component Store?

Then use Feature Store! Wait with ComponentStore until you have a use-case.
Till then, you can benefit from these advantages of Feature Store.

- Debug state with Redux DevTools: Feature Store state becomes part of the global state object.
That object can be inspected with Redux DevTools for a better debugging experience.
- Feature Store state can be more easily shared with other interested components/services (with `store.select()`)
- Feature Store automatically uses the Store extensions (provided via `configureStore` or `StoreModule.forRoot` in Angular). 
Component Store needs a dedicated extension setup: see Component Store ["Extensions"](#extensions).

Feature Stores are also destroyable and the same Feature Store can be instantiated many times. This makes them suitable for local state management as well (see [Local Component State](fs-config)).

If you encounter the Component Store use-cases from above, it will be easy to refactor from `FeatureStore` to `ComponentStore` (in most cases).
:::info

## What's Included
The MiniRx `ComponentStore` API:
- `setState()` update the state
- `setInitialState()` initialize state lazily
- `select()` select state as RxJS Observable
- `effect()` run side effects like API calls and update state
- `undo()` easily undo setState actions (requires the UndoExtension)
- `destroy()` clean up all internal Observable subscriptions (e.g. from effects)
- `tapResponse` operator: handle the response in Component Store `effect` consistently and with less boilerplate

Since the API of `ComponentStore` is identical to `FeatureStore`, please refer to the 
[Feature Store docs](fs-quick-start) for more details. 

## Create a Component Store

There are 2 Options to create a new Component Store.

### Option 1: Extend ComponentStore

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

We can create a Component Store with `createComponentStore`.

```ts
import { ComponentStore, createComponentStore } from 'mini-rx-store';

const counterCs: ComponentStore<CounterState> = createComponentStore<CounterState>(initialState);
```


## Extensions
You can use most of the [MiniRx extensions](ext-quick-start) with the Component Store.

Extensions with Component Store support:

- Immutable Extension: Enforce state immutability
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current "setState" action and updated state

It's possible to configure the Component Store extensions globally or individually for each Component Store instance.

### Global setup

```typescript
import {
  configureComponentStores,
} from 'mini-rx-store';

configureComponentStores({
  extensions: [new ImmutableStateExtension()]
});
```
Now every Component Store instance will have the ImmutableStateExtension. 

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
Like that every Component Store can benefit from immutable state.

The LoggerExtension can be added to individual Component Stores for debugging purposes (["Local setup"](#local-setup)).

Regarding the `undo` API: add the UndoExtension to the Component Stores which need the undo functionality (["Local setup"](#local-setup)). 
:::info

