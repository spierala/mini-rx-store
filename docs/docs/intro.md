---
id: intro
title: Quick Start
sidebar_label: Quick Start
slug: /intro
---

## Purpose
**MiniRx Store** provides Reactive State Management for JavaScript Applications, inspired by [Redux](https://redux.js.org/).
It is a global, application-wide solution to manage state and is powered by [RxJS](https://rxjs.dev/).

## What's Included
-   RxJS powered global state management
-   State and actions are exposed as RxJS Observables
-   [Store (Redux API)](redux):
    -   Actions
    -   Reducers
    -   Meta Reducers
    -   Memoized Selectors
    -   Effects
    -   `mapResponse` operator: handle the side effect response in Effects
    -   [Support for ts-action](ts-action): Create and consume actions with as little boilerplate as possible
-   [Feature Store](fs-quick-start): Manage feature state directly with a minimum of boilerplate:
    - `setState()` update the feature state
    - `select()` select state from the feature state object as RxJS Observable
    - `effect()` run side effects like API calls and update feature state
    - `undo()` easily undo setState actions (requires UndoExtension)
    - `destroy()` remove the feature state
    - `tapResponse` operator: handle the side effect response in Feature Store `effect` 
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
- The store is a single object which holds the global application state. It is the "single source of truth"
- State is exposed as RxJS Observable
- State has a flat hierarchy and is divided into "feature states" (also called "slices" in Redux world)
- For each "feature state" we can decide to use the **Redux API** with actions and reducers or the simplified **Feature Store API**
- State is read-only (immutable) and can only be changed by dispatching actions (Redux API) or by using `setState` (Feature Store API)

## Basic Tutorial
Let's dive into some code to see MiniRx in action. You can play with the tutorial code on [StackBlitz](https://stackblitz.com/edit/mini-rx-store-basic-tutorial?file=index.ts). 

### Store (Redux API)
MiniRx supports the classic Redux API with registering reducers and dispatching actions.
Observable state can be selected with memoized selectors.

```ts
import {
  Action,
  Store,
  configureStore,
  createFeatureSelector,
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
const getCounterFeatureState = createFeatureSelector<CounterState>('counter');
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

### Feature Store API
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

Use the "counterFs" Feature Store like this:
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

Every new Feature Store will show up in the global state with the corresponding feature key (e.g. 'counterFs').
```ts
store.select(state => state).subscribe(console.log);
// OUTPUT: {"counter":{"count":2},"counterFs":{"count":12}}
```
:::

## Demos
- [MiniRx Store - Basic Tutorial](https://stackblitz.com/edit/mini-rx-store-basic-tutorial?file=index.ts): See the basic tutorial in action
- [MiniRx Store Angular Demo](https://angular-demo.mini-rx.io) ([source code](https://github.com/spierala/mini-rx-store/tree/master/apps/mini-rx-angular-demo))
- [MiniRx Store Svelte Demo](https://svelte-demo.mini-rx.io) ([source code](https://github.com/spierala/mini-rx-svelte-demo))
