![MiniRx - RxJS Redux Store - Logo](.github/images/mini-rx-logo-white-bg.png)

[![NPM](https://img.shields.io/npm/v/mini-rx-store)](https://www.npmjs.com/package/mini-rx-store)
[![Downloads](https://img.shields.io/npm/dt/mini-rx-store)](https://npmcharts.com/compare/mini-rx-store?interval=30)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Tests](https://github.com/spierala/mini-rx-store/workflows/Tests/badge.svg)](https://github.com/spierala/mini-rx-store/actions?query=workflow%3ATests)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> **ℹ Version 2:** Currently we are working on version 2 of mini-rx-store. Please let us know if you have ideas for features that you wish to see in mini-rx-store@2.  See discussion here: https://github.com/spierala/mini-rx-store/discussions/19

# MiniRx Store 2 (beta)

### FOR 1.X PLEASE GO TO [THE 1.x BRANCH](https://github.com/spierala/mini-rx-store/tree/1.x)

**MiniRx Store** provides Reactive State Management for Javascript Applications inspired by [Redux](https://redux.js.org/).
It is a global, application-wide solution to manage state and is powered by [RxJS](https://rxjs.dev/).


- 🤓 Learn about it on the [docs site](https://spierala.github.io/mini-rx-store/)
- 🚀 See it in action on [StackBlitz](https://stackblitz.com/edit/mini-rx-angular-todos?file=src%2Fapp%2Fmodules%2Ftodo%2Fservices%2Ftodos-state.service.ts)

## What's Included
-   RxJS powered global state management
-   State and Actions are exposed as RxJS Observable
-   [Store (Redux API)](https://spierala.github.io/mini-rx-store/docs/redux):
    -   Actions
    -   Reducers
    -   Meta Reducers
    -   Memoized Selectors
    -   Effects
    -   [Support for ts-action](https://spierala.github.io/mini-rx-store/docs/ts-action): Create and consume actions with as little boilerplate as possible
-   [FeatureStore](https://spierala.github.io/mini-rx-store/docs/fs-quick-start): Update state without actions and reducers:
    -   `setState()` update the feature state
    -   `select()` read feature state
    -   `effect()` run side effects like API calls and update feature state
    -   `undo()` easily undo setState actions
-   [Extensions](https://spierala.github.io/mini-rx-store/docs/effects-for-feature-store):
    - Redux Dev Tools Extension: Inspect State with the Redux Dev Tools
    - Immutable Extension: Enforce immutability
    - Undo Extension: Undo dispatched Actions
    - Logger Extension: console.log the current action and updated state
-   Framework agnostic: MiniRx works with any front-end project built with JavaScript or TypeScript (Angular, Svelte, React, Vue, or anything else)
-   TypeScript support: The MiniRx API comes with TypeScript type definitions
-   [Angular Integration](https://spierala.github.io/mini-rx-store/docs/angular): Use MiniRx Store the Angular way: `StoreModule.forRoot()`, `StoreModule.forFeature()`, ...

## Key Concepts
- State is exposed as RxJS Observable
- State has a flat hierarchy and is devided into "features" (also called "slices" in Redux world)
- For each "feature" we can decide to use the **Redux API** with actions and reducers or the **FeatureStore API** with `setState`
- State is read-only and can only be changed by dispatching actions (Redux API) or by using setState (FeatureStore)

## Basic Tutorial
Let's dive into some code to see MiniRx in action

### Store (Redux API)
MiniRx supports the classic Redux API with registering reducers and dispatching Actions.
Observable state can be selected with memoized selectors.

```ts
import { Action, Store, configureStore, createFeatureSelector, createSelector } from "mini-rx-store";
import { Observable } from "rxjs";

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
    case "inc":
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
const getCounterFeatureState = createFeatureSelector<CounterState>("counter");
const getCount = createSelector(
  getCounterFeatureState,
  state => state.count
);

// 6.) Select state as RxJS Observable
const count$: Observable<number> = store.select(getCount);
count$.subscribe(count => console.log('count:', count));

// 7.) Dispatch an action
store.dispatch({ type: "inc" });

// OUTPUT: count: 1
// OUTPUT: count: 2
```
### Feature Store API
`FeatureStore` allows us to manage feature state without actions and reducers.
The API of a FeatureStore is optimized to select and update a feature state directly with a minimum of boilerplate.

```ts title="counter-feature-store.ts"
import { FeatureStore } from "mini-rx-store";
import { Observable } from "rxjs";

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

Use the "counterFs" feature store like this:
```ts
import { CounterFeatureStore } from "./counter-feature-store";

const counterFs = new CounterFeatureStore();
counterFs.counter$.subscribe(count => console.log('count:', count));
counterFs.inc();

// OUTPUT: count: 11
// OUTPUT: count: 12
```

**ℹ The FeatureStore states become part of the global state too.**

Both the Redux feature state and the FeatureStore state are living next to each other in the global state object:

```ts
store.select(state => state).subscribe(console.log);

//OUTPUT: {"counter":{"count":2},"counterFs":{"counter":12}}
```

## References

These projects, articles and courses helped and inspired us to create MiniRx:

-   [NgRx](https://ngrx.io/)
-   [Akita](https://github.com/datorama/akita)
-   [Observable Store](https://github.com/DanWahlin/Observable-Store)
-   [RxJS Observable Store](https://github.com/jurebajt/rxjs-observable-store)
-   [Juliette Store](https://github.com/markostanimirovic/juliette) 
-   [Basic State Managment with an Observable Service](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)
-   [Redux From Scratch With Angular and RxJS](https://www.youtube.com/watch?v=hG7v7quMMwM)
-   [How I wrote NgRx Store in 63 lines of code](https://medium.com/angular-in-depth/how-i-wrote-ngrx-store-in-63-lines-of-code-dfe925fe979b)
-   [NGRX VS. NGXS VS. AKITA VS. RXJS: FIGHT!](https://ordina-jworks.github.io/angular/2018/10/08/angular-state-management-comparison.html?utm_source=dormosheio&utm_campaign=dormosheio)
-   [Pluralsight: Angular NgRx: Getting Started](https://app.pluralsight.com/library/courses/angular-ngrx-getting-started/table-of-contents)
-   [Pluralsight: RxJS in Angular: Reactive Development](https://app.pluralsight.com/library/courses/rxjs-angular-reactive-development/table-of-contents)
-   [Pluralsight: RxJS: Getting Started](https://app.pluralsight.com/library/courses/rxjs-getting-started/table-of-contents)

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/PieterVanPoyer"><img src="https://avatars2.githubusercontent.com/u/33040889?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pieter Van Poyer</b></sub></a><br /><a href="https://github.com/spierala/mini-rx-store/commits?author=PieterVanPoyer" title="Code">💻</a></td>
    <td align="center"><a href="https://www.florian-spier.be"><img src="https://avatars3.githubusercontent.com/u/1272446?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Florian Spier</b></sub></a><br /><a href="https://github.com/spierala/mini-rx-store/commits?author=spierala" title="Code">💻</a> <a href="#ideas-spierala" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Thocaten"><img src="https://avatars.githubusercontent.com/u/79323279?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Carsten</b></sub></a><br /><a href="#design-Thocaten" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
