---
id: fs-select
title: Select State
sidebar_label: Select
slug: select-feature-state
---

## Reactive Select
```ts title="todo-feature-store.ts"
import { Observable } from 'rxjs';

todos$: Observable<Todo[]> = this.select(state => state.todos);
```

`select` takes a callback function which gives you access to the current **feature state** (see the `state` parameter).
Within that function you can pick a specific piece of state.
`select` returns an Observable which will emit as soon as the selected state changes.

## Memoized Selectors

You can use memoized selectors also with the Feature Store...
You only have to omit the feature key when using `createFeatureStateSelector`.
This is because the Feature Store is operating on a specific feature state already
(the corresponding feature key has been provided in the constructor).

```ts title="todo-feature-store.ts"
import { createFeatureStateSelector, createSelector } from 'mini-rx-store';

// Memoized Selectors
const getTodoFeatureState = createFeatureStateSelector<TodoState>(); // Omit the feature key!

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

class TodoFeatureStore extends FeatureStore<TodoState> {

  // State Observables
  todoState$: Observable<TodoState> = this.select(getTodoFeatureState);
  todos$: Observable<Todo[]> = this.select(getTodos);
  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);

  constructor() {
    super('todoFs', initialState) // Feature key 'todosFs' is provided here already...
  }

  addTodo(todo: Todo) {
    this.setState(state => ({
      todos: [...state.todos, todo]
    }))
  }

  selectTodo(id: number) {
    this.setState({selectedTodoId: id});
  }
}
```
