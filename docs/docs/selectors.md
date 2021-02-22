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

MiniRx comes with memoized selectors out of the box. With the selectors we can easily select and combine state. The MiniRx selectors are memoized to prevent unnecessary calculations.

### createFeatureSelector
`createFeatureSelector` selects a feature state from the global state object.
We have to use the same key that we used for registering the feature reducer (e.g. we used the 'todo' key for the todoReducer).
```ts title="todo-selectors.ts"
import { createFeatureSelector } from 'mini-rx-store';
import { TodoState } from './todo-reducer';

export const getTodoFeatureState = createFeatureSelector<TodoState>('todo');
```

### createSelector
With `createSelector` we can require many other selectors to create a new selector.
The last argument passed to `createSelector` is the projection function.
In the projection function we can access the return values of the required selectors.

```ts title="todo-selectors.ts"
import { createSelector } from 'mini-rx-store'

export const getTodos = createSelector(
    getTodoFeatureState,
    state => state.todos
);

export const getSelectedTodoId = createSelector(
    getTodoFeatureState,
    state => state.selectedTodoId
)

export const getSelectedTodo = createSelector(
    getTodos,
    getSelectedTodoId,
    (todos, id) => todos.find(item => item.id === id)
)
```
Let's use the memoized selectors to create our state Observables:
```ts
import { getTodoFeatureState, getTodos, getTodosCount } from './todo-selectors';

const todoState$: Observable<TodoState> = store.select(getTodoFeatureState);
const todos$: Observable<Todo[]> = store.select(getTodos);
const selectedTodo$: Observable<Todo> = store.select(getSelectedTodo);
```
