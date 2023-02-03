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
- State is fully **local** to a component, and you do not want to bother the global state object with that state.
- **Frequent create/destroy:** Component Stores are created and destroyed in a performant way.
- **Very frequent state changes** could lead to performance issues when using `Store` or `FeatureStore` 
(both update the global state object using actions and reducers, which means more overhead).

:::info
Component Store is great for the mentioned use-cases. However, in most other cases you will be better off using MiniRx [Feature Store](fs-quick-start):

- Better debugging experience: Inspect Feature Store state with Redux DevTools
- Feature Store state can be more easily shared with other interested components/services (with `store.select()`)
- Feature Store automatically uses the Store extensions (provided via `configureStore` or `StoreModule.forRoot` in Angular). 
- It is even possible to manage local state with Feature Stores (see [Local Component State with Feature Store](fs-config)).

But don't worry, your Component Store can be easily migrated to a Feature Store and vice versa!  
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

Configure extensions globally for every Component Store:

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

Configure extensions individually via the Component Store configuration object:

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

"Local" extensions are merged with the (global) extensions from `configureComponentStores`.
Therefore, every `CounterStore` instance will have the LoggerExtension (from the local extension setup) **and** the
ImmutableStateExtension (from the `configureComponentStores` extensions).

If an extension is defined globally and locally, then the local extension takes precedence.

:::info
It makes sense to add the ImmutableStateExtension to `configureComponentStores`.
Like that every Component Store can benefit from immutable state.

The LoggerExtension can be added to individual Component Stores for debugging purposes (["Local setup"](#local-setup)).

Regarding the `undo` API: add the UndoExtension to the Component Stores which need the undo functionality (["Local setup"](#local-setup)). 
:::info

## Memoized selectors

Of course, you can use memoized selectors also with Component Store! 

### `createComponentStateSelector`

You can use `createComponentStateSelector` together with `createSelector` to create your selector functions.

Example:

```ts
// Memoized Selectors
const getTodoFeatureState = createComponentStateSelector<TodoState>();

const getTodos = createSelector(
  getTodoFeatureState,
  state => state.todos
);

const getSelectedTodoId = createSelector(
  getTodoFeatureState,
  state => state.selectedTodoId
)

const getSelectedTodo = createSelector(
  getTodos,
  getSelectedTodoId,
  (todos, id) => todos.find(item => item.id === id)
)

class TodoFeatureStore extends ComponentStore<TodoState> {

  // State Observables
  todoState$: Observable<TodoState> = this.select(getTodoFeatureState);
  todos$: Observable<Todo[]> = this.select(getTodos);
  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);

  constructor() {
    super(initialState)
  }
}
```
