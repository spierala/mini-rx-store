MiniRx **Signal Store** is in the making...

* 🤓 See the Signal Store **RFC** on GitHub discussions: https://github.com/spierala/mini-rx-store/discussions/188
* 🤓 Signal Store **Pull Request** on GitHub: https://github.com/spierala/mini-rx-store/pull/195
* A pre-release version can be loaded from npm: https://www.npmjs.com/package/@mini-rx/signal-store

## What can we expect from MiniRx Signal Store?

* Signal Store is an **[Angular](https://angular.dev/)-only** state management library
* Signal Store **embraces [Angular Signals](https://angular.io/guide/signals)** and leverages **Modern Angular APIs** internally
* Signal Store is based on the same great concept as the original **[MiniRx Store](https://mini-rx.io/)**
    * Manage **global** state at large scale with the **Store (Redux) API**
    * Manage **global** state with a minimum of boilerplate using **Feature Stores**
    * Manage **local** component state with **Component Stores**
    * MiniRx always tries to find the sweet spot between powerful, simple and [lightweight](https://github.com/spierala/angular-state-management-comparison)
* Signal Store implements and promotes new **Angular best practices**:
  * **Signals** are used for **(synchronous) state**
  * **RxJS** is used for events and **asynchronous tasks**
* Signal Store helps to streamline your usage of [RxJS](https://rxjs.dev/) and [Signals](https://angular.io/guide/signals): e.g. `connect` and `rxEffect` understand both Signals and Observables
* Simple refactor: If you used MiniRx Store before, refactor to Signal Store will be pretty straight-forward: change the TypeScript imports, remove the Angular async pipes (and ugly non-null assertions (`!`)) from the template

# API Preview
Let's have a closer look at the Signal Store API.

Most APIs are very similar to the original MiniRx Store. We will focus here on the changed and new APIs.

## Component Store and Feature Store

_FYI_ Feature Store and Component Store share the same API (just their internal working and their use-cases are different). 

In the examples below we look at Component Store, but you can expect the same API changes for Feature Store.

All code examples can be found back in [this StackBlitz](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fmain.ts).

### select
`select` is used to select state from your Component Store. 

You can probably guess it already..., the `select` method returns an **Angular Signal**.

Example:
```ts
import { Component, Signal } from '@angular/core';
import { createComponentStore } from '@mini-rx/signal-store';

@Component({
// ...
})
export class SelectDemoComponent {
  private cs = createComponentStore({counter: 1});
  doubleCounter: Signal<number> = this.cs.select(state => state.counter * 2)
}
```

Read the Signal like this in the template:
```html
<pre>
  doubleCount: {{doubleCounter()}},
</pre>  
```

The `select` method is exposed by Store, Feature Store and Component Store.

StackBlitz demo: [SelectDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fselect-demo%2Fselect-demo.component.ts)

### ~~setInitialState~~
There is no `setInitialState` method anymore in Feature Store/Component Store for lazy state initialisation. 
An initialState is now always required by Feature Store and Component Store, which is more inline with native Angular Signals.

### connect
The `connect` method is new! With `connect` you can **connect** your store with external sources like **Observables and Signals**.
This helps to make your store the **Single Source of Truth** for your state.

_FYI_ `setState` does not support an Observable parameter anymore, use `connect` instead.

Example:

```ts
import { Component, signal } from '@angular/core';
import { ComponentStore, createComponentStore } from '@mini-rx/signal-store';
import { timer } from 'rxjs';

interface State {
  counterFromObservable: number;
  counterFromSignal: number;
}

@Component({
// ...
})
export class ConnectDemoComponent {
  cs: ComponentStore<State> = createComponentStore<State>({
    counterFromObservable: 0,
    counterFromSignal: 0,
  });

  constructor() {
    const interval = 1000;

    const observableCounter$ = timer(0, interval); // Observable
    const signalCounter = signal(0); // Signal

    // Connect external sources (Observables or Signals) to the Component Store
    this.cs.connect({
      counterFromObservable: observableCounter$, // Observable
      counterFromSignal: signalCounter, // Signal
    });

    setInterval(() => signalCounter.update((v) => v + 1), interval);
  }
}
```
Access the Signals in the Component template:
```html
<!-- Access top level state properties easily from the cs.state Signal -->
<ng-container *ngIf="cs.state() as state">
  <pre>
    counterFromRxJS: {{ state.counterFromObservable }}, 
    counterFromSignal: {{ state.counterFromSignal }}
  </pre>
</ng-container>
```
StackBlitz demo: [ConnectDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fconnect-demo%2Fconnect-demo.component.ts)

## rxEffect

The `effect` method has been renamed to `rxEffect` (to avoid confusion with the Angular Signal `effect` function).

Feature Store and Component Store expose the `rxEffect` method to trigger side effects like API calls.

`rxEffect` returns a function which can be called later to start the side effect with an optional payload.

In the following example you can see that you can trigger the side effect with **a Raw Value, an Observable and of course a Signal**:

```ts
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createComponentStore, tapResponse } from '@mini-rx/signal-store';
import { of, Observable, map, switchMap, delay } from 'rxjs';

function apiCall(filter: string): Observable<string[]> {
// ...
}

interface State {
  cities: string[];
}

@Component({
// ...
})
export class EffectDemoComponent {
  cs = createComponentStore<State>({
    cities: [],
  });

  private fetchCitiesEffect = this.cs.rxEffect<string>(
    switchMap((filter) => {
      return apiCall(filter).pipe(
        tapResponse({
          next: (cities) => this.cs.setState({ cities }),
          error: console.error,
        })
      );
    })
  );

  formControl = new FormControl();
  private filterChangeObservable$ = this.formControl.valueChanges; 
  private filterChangeSignal = signal('');

  constructor() {
    // Observable
    // Every emission of the Observable will trigger the API call
    this.fetchCitiesEffect(this.filterChangeObservable$);
    // Signal
    // The Signals initial value will immediately trigger the API call
    // Every new Signal value will trigger the API call
    this.fetchCitiesEffect(this.filterChangeSignal); 
  }

  triggerEffectWithSignal() {
    // Update the Signal value
    this.filterChangeSignal.set('');

    setTimeout(() => {
      this.filterChangeSignal.set('a');
    }, 1000);

    setTimeout(() => {
      this.filterChangeSignal.set('c');
    }, 2000);
  }

  triggerEffectWithRawValue() {
    // Trigger the API call with a raw value
    this.fetchCitiesEffect('Phi');
  }
}
```

Component template:
```html
<!-- Access top level state properties easily from the cs.state Signal -->
<ng-container *ngIf="cs.state() as state"> 
  <label>Trigger Effect with RxJS Observable (FormControl.valueChanges):</label>
  <input [formControl]="formControl" placeholder="Search city...">
  <pre>cities: {{state.cities | json}}</pre>  

  <button (click)="triggerEffectWithSignal()">Trigger Effect with Signal</button><br>
  <button (click)="triggerEffectWithRawValue()">Trigger Effect with Raw Value</button>
</ng-container>
```
StackBlitz demo: [EffectDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Feffect-demo%2Feffect-demo.component.ts)

## Memoized Signal Selectors

`createSelector`, `createFeatureStateSelector` and `createComponentStateSelector` return a **SignalSelector** function. 
Signal Selector functions take a Signal and return a Signal.

You can pass Signal Selectors to the `select` method of Store, Feature Store and Component Store.

Signal Selectors are memoized for fewer computations of the projector function.

**Fun fact**: Angular Signal `computed` is used to implement Signal Selectors.

Example: Selecting state from the Redux Store

```ts
import { Component, inject, Signal } from "@angular/core";
import { createFeatureStateSelector, createSelector, Store } from "@mini-rx/signal-store";
import { Todo, TodosState } from "./todo-state";

// Memoized SignalSelectors
const getFeature = createFeatureStateSelector<TodosState>('todos');
const getTodos = createSelector(getFeature, state => state.todos);
const getTodosDone = createSelector(getTodos, todos => todos.filter(item => item.isDone))
const getTodosNotDone = createSelector(getTodos, todos => todos.filter(item => !item.isDone))

@Component({
// ...
})
export class MemoizedSignalSelectorsDemoComponent {
  private store = inject(Store); // Store is provided in the main.js file
  todosDone: Signal<Todo[]> = this.store.select(getTodosDone);
  todosNotDone: Signal<Todo[]> = this.store.select(getTodosNotDone);
}
```

Access the Signals in the Component template:
```html
<pre>DONE: {{ todosDone() | json }}</pre>
<pre>NOT DONE: {{ todosNotDone() | json }}</pre>
```
StackBlitz demo: [MemoizedSignalSelectorsDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fmemoized-signal-selectors-demo%2Fmemoized-signal-selectors-demo.component.ts)

### Component Store destruction

With Signal Store you can safely create a Component Store inside components. The Component Store will be automatically destroyed together with the component.

This is possible because the Component Store uses Angular `DestroyRef` internally.

Example: Child component with a local Component Store. The child component visibility is toggled in the parent component.

```ts
@Component({
  // ...
})
export class DestroyDemoChildComponent {
  // Create a local Component Store
  cs = createComponentStore({counter: 1}); 

  constructor() {
    // Connect a RxJS timer to the Component Store
    this.cs.connect({counter: timer(0, 1000).pipe(
      tap(v => console.log('timer emission:', v)) // We can see the logging WHILE the ChildComponent is visible (see the JS console)
    )})
  }
}
```

When the child component is destroyed, the Component Store will be destroyed as well. 
The cleanup logic of Component Store will be executed which unsubscribes from all internal subscriptions (which includes the timer subscription).

StackBlitz demo: [DestroyDemoChildComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fdestroy-demo%2Fchild%2Fdestroy-demo-child.component.ts)

## Immutable Signal state

When using Angular Signals you can bypass the Signal `update` or `set` methods and mutate state at anytime.

This can cause unexpected behaviour and bugs.

MiniRx Signal Store comes with the ImmutableState Extension to prevent mutations (which exists also in the original MiniRx Store).

If you accidentally mutate the state, an error will be thrown in the JS console.

```ts
@Component({
// ...
})
export class ImmutableDemoComponent {
  private signalState = signal({counter: 1});
  counterFromSignal = computed(() => this.signalState().counter);

  cs = createComponentStore({counter: 1}, {
    extensions: [new ImmutableStateExtension() // FYI you could add extensions globally with `provideComponentStoreConfig` in main.ts
  ]});
  counterFromComponentStore = this.cs.select(state => state.counter);

  // SIGNAL
  // valid state update
  incrementSignalCounter() {
    this.signalState.update(state => ({...state, counter: state.counter + 1}))
  }

  // Signal Mutations
  // no error, you are entering danger zone, without knowing it
  mutateSignalA() {
    this.signalState().counter = 666;
  }

  mutateSignalB() {
    this.signalState.update(state => {
      state.counter = 666;
      return state;
    })
  }

  // COMPONENT STORE
  // valid state update
  incrementComponentStoreCounter() {
    this.cs.setState(state => ({counter: state.counter + 1}))
  }

  // Component Store Signal Mutations
  // As expected, mutating state will throw an error
  mutateComponentStoreSignalA() {
    this.cs.state().counter = 666; 
  }

  mutateComponentStoreSignalB() {
    this.cs.setState(state => {
      state.counter = 666;
      return state;
    })
  }
}
```
StackBlitz demo: [ImmutableDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fimmutable-demo%2Fimmutable-demo.component.ts)

## Store (Redux)

Let's have a quick look at the API changes of the Store (Redux) API...

### select
`select` is used to select state from your store. The `select` method returns an Angular Signal.

We can look again at the memoized selectors example to see `select` in action:

```ts
import { Component, inject, Signal } from "@angular/core";
import { createFeatureStateSelector, createSelector, Store } from "@mini-rx/signal-store";
import { Todo, TodosState } from "./todo-state";

@Component({
// ...
})
export class MemoizedSignalSelectorsDemoComponent {
  private store = inject(Store); // Store is provided in the main.js file
  todosDone: Signal<Todo[]> = this.store.select(getTodosDone);
  todosNotDone: Signal<Todo[]> = this.store.select(getTodosNotDone);
}
```

### createRxEffect

The (Redux) Store effects API is pretty much unchanged. Just `createEffect` has been renamed to `createRxEffect`. The new name clearly indicates that the method is used in relation to RxJS Observables.

Small example from the [Signal Store RFC](https://github.com/spierala/mini-rx-store/discussions/188):

```ts
import {
    Actions,
    createRxEffect,
    mapResponse,
} from '@mini-rx/signal-store';
import { ofType } from 'ts-action-operators';

@Injectable()
export class ProductsEffects {
  constructor(private productService: ProductsApiService, private actions$: Actions) {}

  loadProducts$ = createRxEffect(
    this.actions$.pipe(
      ofType(load),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          mapResponse(
            (products) => loadSuccess(products),
            (error) => loadFail(error)
          )
        )
      )
    )
  );
} 
```

## Standalone APIs

MiniRx Signal Store got modern Angular standalone APIs.

Here is a quick overview:

* `provideStore`: Set up the Redux Store with reducers, metaReducers and extensions
* `provideFeature`: Add a feature state with a reducer (via the route config)
* `provideEffects`: Register effects (via the route config)
* `provideComponentStoreConfig`: Configure all Component Stores with the same config

_FYI_ In module-based Apps you can still use the classic API: `StoreModule.forRoot()`, `StoreModule.forFeature()`, `EffectsModule.register()` and `ComponentStoreModule.forRoot()`.


## Feedback

We hope that you like the upcoming Signal Store! 

If you see things which could be better or different, please let us know and leave a comment.

You can also contribute to Signal Store by commenting on the [RFC](https://github.com/spierala/mini-rx-store/discussions/188) or [Pull Request](https://github.com/spierala/mini-rx-store/pull/195) on GitHub.

## Thanks
Special thanks for reviewing this blog post:

- [Pieter van Poyer](https://github.com/PieterVanPoyer)
