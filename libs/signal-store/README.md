Welcome to **MiniRx Signal Store**, the new state management library from [MiniRx](https://mini-rx.io/).

With the arrival of [Signals](https://angular.io/guide/signals) in Angular 16, new best practices are arising for state and events. In the future Signals and Observables will coexist in your application.

Modern Angular needs modern state management which promotes **new Angular best practices** and **streamlines the usage of Signals and Observables**...

MiniRx Signal Store does exactly that.

### Modern state management with MiniRx Signal Store:

* Signal Store is an **[Angular](https://angular.dev/)-only** state management library
* Signal Store **embraces [Angular Signals](https://angular.io/guide/signals)** and leverages **Modern Angular APIs** internally
* Signal Store is based on the same great concept as the original **[MiniRx Store](https://mini-rx.io/)**
    * Manage **global** state at large scale with the **Store (Redux) API**
    * Manage **global** state with a minimum of boilerplate using **Feature Stores**
    * Manage **local** component state with **Component Stores**
    * All combined in a single library!
    * MiniRx always tries to find the sweet spot between powerful, simple and [lightweight](https://github.com/spierala/angular-state-management-comparison)!
* Signal Store implements and promotes new **Angular best practices**:
    * **Signals** are used for **(synchronous) state**
    * **RxJS** is used for events and **asynchronous tasks**
* Signal Store helps to streamline your usage of [RxJS](https://rxjs.dev/) and [Signals](https://angular.io/guide/signals): e.g. `connect` and `rxEffect` understand both Signals and Observables
* Signal Store has first-class support for OOP style (e.g. `MyStore extends FeatureStore`), but offers also functional creation methods (e.g. `createFeatureStore`)
* Simple refactor: If you used MiniRx Store before, refactor to Signal Store will be straight-forward: change the TypeScript imports, remove the Angular async pipes (and ugly non-null assertions (`!`)) from the template

### Getting Started
To install the @mini-rx/signal-store package, use your package manager of choice:

`npm install @mini-rx/signal-store`

### Use-cases

MiniRx Signal Store is highly flexible and offers three different well-defined state containers out of the box:

- Store (Redux)
- Feature Store
- Component Store

All three can be easily used together in your application.
Depending on the use-case, you can choose the state container which suits your needs.

These are the typical use-cases:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qj5anf3ibwrjw20yu6t0.png)

## Redux API

The Redux pattern is great to manage state at large scale. MiniRx Signal Store offers a powerful Redux API.

- Actions: objects which describe events with an optional payload
- Reducers
    - pure functions which know how to update state (based on the current state and a given action)
    - reducers are run for every action in order to calculate the next state
- Effects: listen to a specific action, run side effects like API calls and handle race conditions (with RxJS flattening operators)
- Memoized selectors: pure functions which describe how to select state from the global state object
- Store
    - holds the global state object
    - wires everything up (reducers, effects)
    - exposes the public Store API (`dispatch`, `select`)

### Actions

You define Actions like this:

```ts
import { action, payload } from 'ts-action';
import { Product } from '../models';

export const loadProducts = action('[Products] load');
export const loadProductsSuccess = action(
  '[Products] load success',
  payload<Product[]>(),
);
export const loadProductsError = action('[Products] load error');

export const deleteProduct = action(
  '[Products] delete',
  payload<{ id: number }>(),
);
```
_FYI_ the powerful [ts-action](https://www.npmjs.com/package/ts-action) library is used to create actions with less boilerplate.

### Reducer

Defining a reducer looks like this:

```ts
import { on, reducer } from 'ts-action';
import { ProductsState } from './index';
import {
  deleteProduct,
  loadProductsSuccess,
} from './product.actions';

const initialState: ProductsState = {
  list: [],
};

export const productReducer = reducer(
  initialState,
  on(loadProductsSuccess, (state, { payload }) => ({
    ...state,
    list: payload,
  })),
  on(deleteProduct, (state, { payload }) => ({
    ...state,
    list: state.list.filter((item) => item.id !== payload.id),
  })),
);
```
_FYI_ the powerful [ts-action](https://www.npmjs.com/package/ts-action) library is used to create reducers with less boilerplate.

### Effects

You create an effect like this:
- Listen to a specific action
- Run an (in most cases) asynchronous task
- Return a new action, when the task succeeded/failed

```ts
import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createRxEffect,
  mapResponse,
} from '@mini-rx/signal-store';
import { ofType } from 'ts-action-operators';
import { ProductApiService } from '../product-api.service';
import { mergeMap } from 'rxjs';
import {
  loadProducts,
  loadProductsError,
  loadProductsSuccess,
} from './product.actions';

@Injectable()
export class ProductEffects {
  actions$ = inject(Actions);
  todosApi = inject(ProductApiService);

  loadTodos$ = createRxEffect(
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(() =>
        this.todosApi.getTodos().pipe(
          mapResponse(
            (res) => loadProductsSuccess(res),
            (err) => loadProductsError,
          ),
        ),
      ),
    ),
  );
}
```

### Register reducers and effects

You can register reducers and effects with modern Angular standalone APIs (`provideStore`, `provideEffects`) when initializing the app:
```ts
import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';
import {
  ImmutableStateExtension,
  provideEffects,
  provideStore,
  ReduxDevtoolsExtension,
} from '@mini-rx/signal-store';
import { productReducer } from './products/state/product.reducer';
import { ProductEffects } from './products/state/product.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      reducers: {
        product: productReducer,
      },
      extensions: [
        new ReduxDevtoolsExtension({ name: 'Signal Store Demo' }),
        new ImmutableStateExtension(),
      ],
    }),
    provideEffects(ProductEffects),
  ],
};
```

### Register reducers and effects via a lazy loaded component

It is possible to register reducers together with a lazy loaded component (see `provideFeature`).
For registering effects you can use `provideEffects`.

```ts
import { Routes } from '@angular/router';
import { ProductShellComponent } from './products-shell/product-shell.component';
import { productReducer } from './state/product.reducer';
import {
  provideEffects,
  provideFeature,
} from '@mini-rx/signal-store';
import { ProductEffects } from './state/product.effects';

export const productRoutes: Routes = [
  {
    path: '',
    component: ProductShellComponent,
    // Lazy load the products state
    providers: [
      provideFeature('products', productReducer),
      provideEffects(ProductEffects),
    ],
  },
];
```

### Memoized selectors

Memoized selectors are used to select state from the global state object.
You can compose selectors from other selectors, which makes code reuse easy.
Last but not least, memoized selectors can be good for performance, if you have to perform more complex computations for selecting state.

```ts
import {
  createFeatureStateSelector,
  createSelector,
} from '@mini-rx/signal-store';
import { Product } from '../models';

// State interface
export type ProductsState = {
  list: Product[];
}

// Memoized selectors
const getProductsFeature =
  createFeatureStateSelector<ProductsState>('product');
export const getProducts = createSelector(
  getProductsFeature,
  (state) => state.list,
);
```

_FYI_

Memoized selectors use Signal `computed` internally to reduce the amount of calculations.

Usage of the selectors e.g. in a component:
```ts
export class ProductShellComponent implements OnInit {
  private store = inject(Store);
  products: Signal<Product[]> = this.store.select(getProducts);
}
```

### Redux Store usage in components

Your components can read state from the store via the `select` method.

`select` returns an Angular Signal.

The `dispatch` method is used to notify the store about new events (aka actions).
```ts
import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@mini-rx/signal-store';
import { Product } from '../models';
import { getProducts } from '../state';
import {
  deleteProduct,
  loadProducts,
} from '../state/product.actions';

@Component({
// ...
})
export class ProductShellComponent implements OnInit {
  private store = inject(Store);
  products: Signal<Product[]> = this.store.select(getProducts);

  ngOnInit() {
    this.store.dispatch(loadProducts());
  }

  deleteProduct(todo: Product) {
    this.store.dispatch(deleteProduct({ id: todo.id }));
  }
}
```

### Redux DevTools

Of course, MinRx Signal Store supports Redux DevTools. With Redux DevTools you can inspect the current state and see which actions have been dispatched.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bmnhd39ltnyzkvhdjkmq.png)

### Extensions
- Redux DevTools Extension: Inspect global state with the Redux DevTools
- Immutable Extension: Enforce Signal state immutability
- Undo Extension: Undo dispatched actions
- Logger Extension: console.log the current action and updated state

## Feature Store API

Feature Store offers a more simple API to manage state, but it still uses the Redux store under the hood.

### Implementation
MiniRx implements and promotes new Angular best practices also in the Feature Store:
- The state is implemented and exposed as Angular Signal
- An RxJS Subject is used for effects to run asynchronous tasks

### What's included
- `setState` update feature state directly with a minimum of boilerplate
- `select` read feature state as Angular Signal
- `rxEffect` trigger side effects like API calls and handle race-conditions with RxJS flattening operators
    - effects can be triggered with Signals, Observables and Raw Values
- `connect` connect external sources like Signals or Observables to your feature state
- `undo` undo state changes (requires the Undo extension)

### Example using `extends FeatureStore`

A typical Feature Store looks like this (a Singleton Angular service which extends `FeatureStore`):

```ts
import { inject, Injectable, Signal } from '@angular/core';
import { FeatureStore } from '@mini-rx/signal-store';
import { Todo } from './models';
import { TodoApiService } from './todos-api.service';

type TodoState = {
  list: Todo[];
};

const initialState: TodoState = {
  list: [],
};

@Injectable({
  providedIn: 'root',
})
export class TodosStoreService extends FeatureStore<TodoState> {
  private api = inject(TodoApiService);

  todosDone: Signal<Todo[]> = this.select((state) =>
    state.list.filter((item) => item.isDone),
  );
  todosNotDone: Signal<Todo[]> = this.select((state) =>
    state.list.filter((item) => !item.isDone),
  );

  constructor() {
    super('todo', initialState);
  }

  loadTodos(): void {
    this.api
      .getTodos()
      .subscribe((todos) => this.setState({ list: todos }));
  }

  toggleDone(todo: Todo): void {
    this.setState((state) => ({
      list: state.list.map((item) =>
        item.id === todo.id
          ? { ...item, isDone: !item.isDone }
          : item,
      ),
    }));
  }
}
```

You can see that state is read via the `select` method. Instead of dispatching actions you use `setState` to update state directly with a minimum of boilerplate.

### Feature Store and Redux DevTools

Feature Stores use Redux under the hood and their state becomes part of the global state object.

For that reason you can easily debug your Feature Stores with the Redux DevTools.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9h68e1b0uggyfd9fi2td.png)

### Advanced Feature Stores
When your state becomes more complex, Feature Store will scale with your state management needs.

- Use memoized selectors (`createFeatureStateSelector`, `createSelector`) which are great for code re-use and performance
    - Memoized selectors can easily be moved to another file
- Use `rxEffect` to trigger side effects like API calls and handle race conditions (e.g. with RxJS `switchMap`)

```ts
import { inject, Injectable, Signal } from '@angular/core';
import {
  createFeatureStateSelector,
  createSelector,
  FeatureStore,
  tapResponse,
} from '@mini-rx/signal-store';
import { Todo } from './models';
import { TodoApiService } from './todos-api.service';
import { switchMap } from 'rxjs';

// Memoized Selectors
const getFeatureState = createFeatureStateSelector<TodoState>();
const getList = createSelector(getFeatureState, (state) => state.list);
const getTodosDone = createSelector(getList, (list) =>
  list.filter((item) => item.isDone),
);
const getTodosNotDone = createSelector(getList, (list) =>
  list.filter((item) => item.isDone),
);

@Injectable({
  providedIn: 'root',
})
export class TodosStoreService extends FeatureStore<TodoState> {
  private api = inject(TodoApiService);

  todosDone: Signal<Todo[]> = this.select(getTodosDone);
  todosNotDone: Signal<Todo[]> = this.select(getTodosNotDone);

  // Create an Effect
  loadTodos = this.rxEffect<void>(
    switchMap(() =>
      this.api.getTodos().pipe(
        tapResponse({
          next: (todos) => this.setState({ list: todos }),
          error: (err) => console.log(err),
        }),
      ),
    ),
  );
}
```

### Manage Component State with Feature Stores

You can easily create Feature Stores which are bound to the component life-cycle.

Simply create a Feature Store inside your component.

This example uses the functional creation method `createFeatureStore` which creates a new Feature Store instance for us.

```ts
@Component({
// ...
})
export class TodosShellComponent implements OnInit {
  private api = inject(TodoApiService);

  todoStore = createFeatureStore('todo', initialState);

  todosDone: Signal<Todo[]> = this.todoStore.select((state) =>
    state.list.filter((item) => item.isDone),
  );
  todosNotDone: Signal<Todo[]> = this.todoStore.select((state) =>
    state.list.filter((item) => !item.isDone),
  );

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.api.getTodos().subscribe((todos) => this.todoStore.setState({ list: todos }));
  }
}
```
The "todo" Feature Store will be created and destroyed together with the component.

This works, because Feature Store uses Angular `DestroyRef` internally.

In the Redux DevTools you can see that the "todo" Feature Store had been created and destroyed.

Create:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y1d2i3nl3zx21nr1umuf.png)

Destroy:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w4h1njkgz1wvvln0kl9p.png)

## Component Store API

We have just seen, how Feature Stores can be used to manage local component state. But Feature Stores integrate into the global state object and make use of the Redux Store internally.

With Component Stores you can manage state which should not become part of the global state object.

Furthermore, Component Stores can be used as a performance optimization if you have very frequent state updates or many store instances.

Component Store has the same API as Feature Store. Refactoring from Component Store to Feature Store and vice versa means changing two lines of code.
```ts
import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createComponentStore } from '@mini-rx/signal-store';
import { Todo } from './models';
import { TodoApiService } from './todos-api.service';

@Component({
// ...
})
export class TodosShellComponent implements OnInit {
  private api = inject(TodoApiService);

  // Using Component Store!
  // We do not need a feature key
  todoStore = createComponentStore(initialState);

  todosDone: Signal<Todo[]> = this.todoStore.select((state) =>
          state.list.filter((item) => item.isDone),
  );
  todosNotDone: Signal<Todo[]> = this.todoStore.select((state) =>
          state.list.filter((item) => !item.isDone),
  );

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.api.getTodos().subscribe((todos) => this.todoStore.setState({ list: todos }));
  }
}
```
### Advanced Component Stores

You can guess it already... for more complex component states you can use memoized selectors (`createComponentStateSelector`, `createSelector`) and the `rxEffect` method.

## RxJS and Signal Interop

In modern Angular Observables and Signals will coexist.
Therefore, modern Angular state management should help you to streamline the usage of Observables and Signals.
MiniRx Signal Store APIs can handle both Observables and Signals.
No conversion code is needed anymore (no `toSignal`, `toObservable`).

### `rxEffect`

`rxEffect` is used to trigger side effects like API calls.
There are three different ways to trigger the side effect:

- Raw value
- Signal
- Observable

The example below listens to Signal changes in order to fetch new data.

In Angular 17.1 we have Signal Inputs. You can use a Signal (Input) to fetch the component data:

```ts
import { Component, inject, input, Signal } from '@angular/core';
import { createComponentStore, tapResponse } from '@mini-rx/signal-store';
import { switchMap } from 'rxjs';
import { BookService } from '../book.service';

type State = {
  detail: BookDetail;
  isLoading: boolean;
}

const initialState: State = {
  detail: undefined,
  isLoading: false
}

@Component({
// ...
})
export class BookComponent {
  private store = createComponentStore(initialState);
  private bookService = inject(BookService);

  bookId = input.required<string>(); // Signal Input

  bookDetail: Signal<BookDetail> = this.store.select(state => state.detail);
  isLoading: Signal<boolean> = this.store.select(state => state.isLoading);

  // Create an Effect
  private loadDetail = this.store.rxEffect<string>(
    // Handle race-condition with switchMap
    switchMap(id => {
      this.store.setState({isLoading: true});

      return this.bookService.getBookDetail(id).pipe(
        tapResponse({
          next: (detail: BookDetail) => {this.store.setState({detail})},
          error: () => this.store.setState({isLoading: false})
        })
      )
    })
  )

  constructor() {
    // Fetch detail for every new bookId Signal value
    this.loadDetail(this.bookId)
  }
}
```

Alternatively, an Observable or Raw value could be used to trigger the API call.

### `connect`

With `connect` you can connect your store with external sources like Observables and Signals.
This helps to make your store the Single Source of Truth for your state.

```ts
import { Component, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createComponentStore } from '@mini-rx/signal-store';
import { timer } from 'rxjs';

@Component({
// ...
})
export class ConnectComponent {
  store = createComponentStore({
    counter: 0,
    counterFromObservable: 0, // Will be updated via Observable
    counterFromSignal: 0, // Will be updated via Signal
  });

  sum: Signal<number> = this.store.select((state) => {
    return state.counter + state.counterFromObservable + state.counterFromSignal;
  });

  constructor() {
    const interval = 1000;

    const observableCounter$ = timer(0, interval); // Observable
    const signalCounter = signal(0); // Signal

    // Connect external sources (Observables or Signals) to the Component Store
    this.store.connect({
      counterFromObservable: observableCounter$, // Observable
      counterFromSignal: signalCounter, // Signal
    });

    setInterval(() => signalCounter.update((v) => v + 1), interval);
  }

  increment() {
    this.store.setState((state) => ({ counter: state.counter + 1 }));
  }
}
```

## Demos
MiniRx was successfully tested in these projects:
- [Angular Tetris](https://github.com/trungvose/angular-tetris/pull/45)
- [Angular Jira Clone](https://github.com/trungvose/jira-clone-angular/pull/99)
- [MiniRx Signal Store Demo](https://signal-store-demo.mini-rx.io/)

## Blog Posts:
[MiniRx Signal Store for Angular - API Preview](https://dev.to/this-is-angular/minirx-signal-store-for-angular-api-preview-4e16)

## License
MIT
