---
id: selectors
title: Selectors
sidebar_label: Selectors
slug: /selectors
---

Selectors are used to select a specific piece of state.

## Reactive Select

We can select state with `store.select`. The `select` method returns an Observable which emits when the selected state changes.

`select` takes a callback function which gives access to the current global state:
```ts
import { Observable } from 'rxjs';
import { TodoState } from './todo-reducer';

const globalState$: Observable<any> = store.select(state => state);
const todoState$: Observable<TodoState> = store.select(state => state['todo']);
```

## Memoized Selectors

MiniRx comes with Memoized Selectors out of the box. With these selectors we can easily select and combine state.

### createFeatureSelector
`createFeatureSelector`: Select a feature state from the global state object. 
We have to use the same key that we used for registering the todoReducer ('todo').
```ts title="todo-selectors.ts"
import { createFeatureSelector } from 'mini-rx-store';
import { TodoState } from './todo-reducer';

export const getTodoFeatureState = createFeatureSelector<TodoState>('todo');
```

### createSelector
With `createSelector` we can combine many other selectors to create a new selector. 
The last argument passed to `createSelector` is the projection function. 
In the projection function we can access the return values of the other selectors.

The MiniRx selectors are memoized to prevent unnecessary executions of the projector function.

```ts title="todo-selectors.ts"
import { createSelector } from 'mini-rx-store';

export const getTodos = createSelector(
    getTodoFeatureState,
    todoState => todoState.todos // Projection function
);

export const getTodosCount = createSelector(
    getTodos,
    todos => todos.length
)
```
Let's use the memoized selectors to create our State Observables:
```ts
import { getTodoFeatureState, getTodos, getTodosCount } from './todo-selectors';

const todoState$: Observable<TodoState> = store.select(getTodoFeatureState);
const todos$: Observable<string[]> = store.select(getTodos);
const todosCount$: Observable<number> = store.select(getTodosCount);
```
