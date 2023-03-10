---
id: intro
title: Quick Start
sidebar_label: Quick Start
slug: /intro
---

MiniRx Store provides **Reactive State Management**, powered by [**RxJS**](https://rxjs.dev/).

MiniRx is a highly flexible solution and scales with your state management requirements:

- Manage **global** state at large scale with the **Redux API**
- Manage **global** state directly and with a minimum of boilerplate using **Feature Stores**
- Manage **local** component state with **Component Stores**

## What's Included
-   RxJS powered global state management
-   State and actions are exposed as RxJS Observables
-   [Store (Redux)](redux):
    -   Actions
    -   Reducers
    -   Meta Reducers
    -   Memoized Selectors
    -   Effects
    -   `mapResponse` operator: handle the side effect response in Effects
    -   [Support for ts-action](ts-action): Create and consume actions with as little boilerplate as possible
-   [Feature Store](fs-quick-start): Manage feature state directly with a minimum of boilerplate:
    - `setState()` update the feature state
    - `setInitialState()` initialize state lazily
    - `select()` select state from the feature state object as RxJS Observable
    - `effect()` run side effects like API calls and update feature state
    - `undo()` easily undo setState actions (requires UndoExtension)
    - `destroy()` remove the feature state
    - `tapResponse` operator: handle the side effect response in Feature Store `effect` 
-   [Component Store](component-store): Manage state locally:
    - Component Store has the same simple API as Feature Store (`setState`, `select`, ...)
    - Component Store state is independent of the global state object
    - Component Store is destroyable
    - Component Store is perfect for local component state
-   [Extensions](ext-quick-start):
    - Redux DevTools Extension: Inspect global state with the Redux DevTools
    - Immutable Extension: Enforce state immutability
    - Undo Extension: Undo dispatched actions
    - Logger Extension: console.log the current action and updated state
-   Framework-agnostic: MiniRx works with any front-end project built with JavaScript or TypeScript (Angular, Svelte, React, Vue, or anything else)
-   TypeScript support: The MiniRx API comes with TypeScript type definitions
-   [Angular Integration](angular): Use MiniRx Store the Angular way: 
    - Configure the Store with `StoreModule.forRoot()`
    - Add feature state with `StoreModule.forFeature()`
    - Inject `Store` and `Actions`

## Key Concepts
- The store is a single object which holds the global application state. It is the **"single source of truth"**
- State and actions are exposed as **RxJS Observables**
- State has a **flat hierarchy** and is divided into "feature states" (also called "slices" in Redux world)
- For each "feature state" we can decide to use the **Redux API** with actions and reducers or the simplified **Feature Store API**
- State is **read-only** (immutable) and can only be changed by dispatching actions (Redux API) or by using `setState` (Feature Store API)

## Basic Tutorial
Let's dive into some code to see MiniRx in action. You can play with the tutorial code on [StackBlitz](https://stackblitz.com/edit/mini-rx-store-basic-tutorial?file=index.ts). 

### Store (Redux)
MiniRx supports the classic Redux API with registering reducers and dispatching actions.
Observable state can be selected with memoized selectors.

```ts
import {
  Action,
  Store,
  configureStore, 
  createFeatureStateSelector,
  createSelector
} from 'mini-rx-store';
import { Observable } from 'rxjs';

// 1.) State interface
interface CounterState {
  count: number;
}

// 2.) Initial state
const counterInitialState: CounterState = {
  count: 1
};

// 3.) Reducer
function counterReducer(
  state: CounterState = counterInitialState,
  action: Action
): CounterState {
  switch (action.type) {
    case 'inc':
      return {
        ...state,
        count: state.count + 1
      };
    default:
      return state;
  }
}

// 4.) Get hold of the store instance and register root reducers
const store: Store = configureStore({
  reducers: {
    counter: counterReducer
  }
});

// 5.) Create memoized selectors
const getCounterFeatureState = createFeatureStateSelector<CounterState>('counter');
const getCount = createSelector(
  getCounterFeatureState,
  state => state.count
);

// 6.) Select state as RxJS Observable
const count$: Observable<number> = store.select(getCount);
count$.subscribe(count => console.log('count:', count));
// OUTPUT: count: 1

// 7.) Dispatch an action
store.dispatch({ type: 'inc' });
// OUTPUT: count: 2
```

### Feature Store
With MiniRx Feature Stores we can manage feature state directly with a minimum of boilerplate.

```ts title="counter-feature-store.ts"
import { FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

// State interface
interface CounterState {
  count: number;
}

// Initial state
const counterInitialState: CounterState = {
  count: 11
};

// Extend FeatureStore and pass the State interface
export class CounterFeatureStore extends FeatureStore<CounterState> {
  // Select state as RxJS Observable
  count$: Observable<number> = this.select(state => state.count);

  constructor() {
    // Call super with the feature key and the initial state
    super('counterFs', counterInitialState);
  }

  // Update state with `setState`
  inc() {
    this.setState(state => ({ count: state.count + 1 }));
  }
}
```

Use the "CounterFeatureStore" like this:
```ts
import { CounterFeatureStore } from "./counter-feature-store";

const counterFs = new CounterFeatureStore();
counterFs.count$.subscribe(count => console.log('count:', count));
// OUTPUT: count: 11

counterFs.inc();
// OUTPUT: count: 12
```

:::info
**The state of a Feature Store becomes part of the global state**

Every new Feature Store will show up in the global state with the corresponding feature key (e.g. 'counterFs'):
```ts
store.select(state => state).subscribe(console.log);
// OUTPUT: {"counter":{"count":2},"counterFs":{"count":12}}
```
:::

### Component Store
Manage state locally and independently of the global state object.
Component Store has the identical API as Feature Store.

```ts
import { ComponentStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

// State interface
interface CounterState {
  count: number;
}

// Initial state
const counterInitialState: CounterState = {
  count: 111,
};

// Extend ComponentStore and pass the State interface
export class CounterComponentStore extends ComponentStore<CounterState> {
  // Select state as RxJS Observable
  count$: Observable<number> = this.select((state) => state.count);

  constructor() {
    // Call super with the initial state
    super(counterInitialState);
  }

  // Update state with `setState`
  inc() {
    this.setState((state) => ({ count: state.count + 1 }));
  }
}
```
Use the "CounterComponentStore" like this:
```ts
const counterCs = new CounterComponentStore();
counterCs.count$.subscribe(count => console.log('count:', count));
// OUTPUT: count: 111

counterCs.inc();
// OUTPUT: count: 112
```


## Demos
- [MiniRx Store - Basic Tutorial](https://stackblitz.com/edit/mini-rx-store-basic-tutorial?file=index.ts): See the basic tutorial in action
- [MiniRx Store Angular Demo](https://angular-demo.mini-rx.io) ([source code](https://github.com/spierala/mini-rx-store/tree/master/apps/mini-rx-angular-demo))
- [MiniRx Store Svelte Demo](https://svelte-demo.mini-rx.io) ([source code](https://github.com/spierala/mini-rx-svelte-demo))
