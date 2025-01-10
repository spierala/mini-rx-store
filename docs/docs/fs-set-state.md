---
id: fs-set-state
title: Update State
sidebar_label: Update State
slug: /update-feature-state
---
Use `setState` to update the state of a Feature Store right away.
`setState` accepts a Partial Type. This allows us to pass only some properties of a bigger state interface.
```ts title="todo-feature-store.ts"
selectTodo(id: number) {
  this.setState({selectedTodoId: id});
}
```
Do you need to update the state based on the current state?
`setState` accepts a callback function which gives you access to the current state.
```ts title="todo-feature-store.ts"
// Update state based on current state
addTodo(todo: Todo) {
  this.setState(state => ({
    todos: [...state.todos, todo]
  }))
}
```
For better logging in the JS Console / Redux DevTools you can provide an optional name to the `setState` function:

```ts
this.setState({selectedTodoId: id}, 'selectTodo');
```

### Undo setState Actions with `undo`
We can easily undo `setState` actions with the [Undo Extension](ext-undo-extension) installed.

Calling `setState` returns an action which can be used to perform an Undo.

```ts title="todo-feature-store.ts"
import { Action } from 'mini-rx-store';

removeTodo(id: number): Action {
  return this.setState(state => ({
    todos: state.todos.filter(item => item.id !== id)
  }))
}

removeAndUndo() {
  const todoRemoveAction: Action = this.removeTodo(2);
  this.undo(todoRemoveAction);   
}
```
