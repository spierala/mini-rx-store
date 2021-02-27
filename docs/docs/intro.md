---
id: intro
title: Quick Start
sidebar_label: Quick Start
slug: /intro
---

## Purpose
**MiniRx Store** provides Reactive State Management for JavaScript Applications inspired by [Redux](https://redux.js.org/).
It is a global, application-wide solution to manage state and is powered by [RxJS](https://rxjs.dev/).

## What's Included
-   RxJS powered global state management
-   State and actions are exposed as RxJS Observable
-   [Store (Redux API)](redux):
    -   Actions
    -   Reducers
    -   Meta Reducers
    -   Memoized Selectors
    -   Effects
    -   [Support for ts-action](ts-action): Create and consume actions with as little boilerplate as possible
-   [Feature Store](fs-quick-start): Update state without actions and reducers:
    -   `setState()` update the feature state
    -   `select()` read feature state
    -   `effect()` run side effects like API calls and update feature state
    -   `undo()` easily undo *setState* actions
-   [Extensions](ext-quick-start):
    - Redux Dev Tools Extension: Inspect state with the Redux Dev Tools
    - Immutable Extension: Enforce state immutability
    - Undo Extension: Undo dispatched actions
    - Logger Extension: console.log the current action and updated state
-   Framework agnostic: MiniRx works with any front-end project built with JavaScript or TypeScript (Angular, Svelte, React, Vue, or anything else)
-   TypeScript support: The MiniRx API comes with TypeScript type definitions
-   [Angular Integration](angular): Use MiniRx Store the Angular way: `StoreModule.forRoot()`, `StoreModule.forFeature()`, ...

## Key Concepts
- The store is a single object which holds the global application state. It is the "single source of truth"
- State is exposed as RxJS Observable
- State has a flat hierarchy and is divided into "feature states" (also called "slices" in Redux world)
- For each "feature state" we can decide to use the **Redux API** with actions and a reducer or the **Feature Store API** with `setState`
- State is read-only (immutable) and can only be changed by dispatching actions (Redux API) or by using setState (Feature Store API)

## Basic Tutorial
Let's dive into some code to see MiniRx in action

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

// 7.) Dispatch an action
store.dispatch({ type: 'inc' });

// OUTPUT: count: 1
// OUTPUT: count: 2
```
### Feature Store API
Feature Stores allow us to manage feature states without actions and reducers. 
The `FeatureStore` API is optimized to select and update a feature state directly with a minimum of boilerplate.

```ts title="counter-feature-store.ts"
import { FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

// 1.) State interface
interface CounterState {
  counter: number;
}

// 2.) Initial state
const counterInitialState: CounterState = {
  counter: 11
};

export class CounterFeatureStore extends FeatureStore<CounterState> {

  // Select state as RxJS Observable
  counter$: Observable<number> = this.select(state => state.counter);

  constructor() {
    super('counterFs', counterInitialState)
  }

  // Update state with `setState`
  inc() {
    this.setState(state => ({...state, counter: state.counter + 1}))
  }
}
```

Use the "counterFs" Feature Store like this:
```ts
import { CounterFeatureStore } from './counter-feature-store';

const counterFs = new CounterFeatureStore();
counterFs.counter$.subscribe(count => console.log('count:', count));
counterFs.inc();

// OUTPUT: count: 11
// OUTPUT: count: 12
```

:::info
**The state of a Feature Store becomes part of the global state**

Every new Feature Store will show up in the global state with the corresponding feature key (e.g. "counterFs").
```ts
store.select(state => state).subscribe(console.log);

//OUTPUT: {"counter":{"count":2},"counterFs":{"counter":12}}
```
:::

## Demos
- [Todos App using FeatureStore](https://stackblitz.com/edit/mini-rx-angular-todos?file=src%2Fapp%2Fmodules%2Ftodo%2Fservices%2Ftodos-state.service.ts)
- Coming soon: Redux Demo
