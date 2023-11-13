# MiniRx Signal Store for Angular - API Preview

MiniRx **Signal Store** is in the making...

* 🤓 See the Signal Store **RFC** on GitHub discussions: https://github.com/spierala/mini-rx-store/discussions/188
* 🤓 Signal Store **Pull Request** on GitHub: https://github.com/spierala/mini-rx-store/pull/195
* On npm: https://www.npmjs.com/package/@mini-rx/signal-store

## What can we expect from MiniRx Signal Store?

* Signal Store is based on the same great concept as the original [MiniRx Store](https://mini-rx.io/)
    * Manage **global** state at large scale with the **Store (Redux) API**
    * Manage **global** state with a minimum of boilerplate using **Feature Stores**
    * Manage **local** component state with **Component Stores**
    * MiniRx always tries to find the sweet spot between powerful, simple and [lightweight](https://github.com/spierala/angular-state-management-comparison)
* Signal Store implements new Angular best practices:
  * **Signals** are used for state
  * **RxJS** is used for events and asynchronous tasks
* Signal Store helps to streamline your usage of RxJS and Signals: e.g. `connect` and `rxEffect` understand both Signals and Observables
* If you used MiniRx Store before, refactor to Signal Store will be pretty straight-forward: mostly change TypeScript imports, remove Angular async pipes

## API Preview
Most APIs are very similar to the original MiniRx Store, but these are the most important changes:

### select
`select` is used to select state from your store. 

You can probably guess it already..., the Signal Store `select` method returns an Angular Signal.

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

The `select` method is exposed by Store, FeatureStore and ComponentStore.

StackBlitz demo: [SelectDemoComponent](https://stackblitz.com/edit/stackblitz-starters-6mbywk?file=src%2Fselect-demo%2Fselect-demo.component.ts)

### ~~setInitialState~~
There is no `setInitialState` method anymore in FeatureStore/ComponentStore for lazy state initialisation. 
An initialState is now always required, which is more inline with native Angular Signals.

### connect
The `connect` method is new and available for FeatureStore and ComponentStore.
With `connect` you can connect your store with external sources like Observables and Signals.
This helps to make your store the **Single Source of Truth** for your state.

`setState` does not support an Observable parameter anymore, use `connect` instead.

Example:

```ts
import { Component, signal } from '@angular/core';
import { ComponentStore, createComponentStore } from '@mini-rx/signal-store';
import { timer } from 'rxjs';

interface State {
  counterFromRxJS: number;
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

FeatureStore and ComponentStore expose the `rxEffect` method to trigger side effects like API calls.

`rxEffect` returns a function which can be called later to start the side effect with an optional payload.

In the following example you can see that you can trigger the side effect with a Raw Value, an Observable and of course a Signal:

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

You can pass SignalSelectors to the `select` method of Store, FeatureStore and ComponentStore.

SignalSelectors are memoized for fewer computations of the projector function.

**Fun fact**: Angular Signal `computed` is used to implement SignalSelectors.

Example: Selecting state from the Redux Store

```ts
import { Component, inject, Signal } from "@angular/core";
import { createFeatureStateSelector, createSelector, Store } from "@mini-rx/signal-store";
import { Todo, TodosState } from "./todo-state";

// Memoized "Signal" Selectors
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

## Bonus: Immutable Signal state

When using Angular Signals you can bypass the Signal `update` or `set` methods and mutate state at anytime.

This can cause unexpected behaviour and bugs.

MiniRx Signal Store comes with the ImmutableState Extension to prevent mutations.

If you accidentally mutate the state an error will be thrown in the JS console.

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
