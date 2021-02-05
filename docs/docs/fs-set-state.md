---
id: fs-set-state
title: Update State
sidebar_label: Set State
slug: /update-feature-state
---
Use `setState` to update the state of a Feature Store right away.
`setState` accepts a Partial Type. This allows us to pass only some properties of a bigger state interface.
```ts title="todo-feature-store.ts"
selectTodo(id: number) {
    this.setState({selectedTodoId: id});
}
```
Do you need to update the new state based on the current state?
`setState` accepts a callback function which gives you access to the current state.
```ts title="todo-feature-store.ts"
// Update state based on current state
addTodo(todo: Todo) {
    this.setState(state => ({
        todos: [...state.todos, todo]
    }))
}
```
For better logging in the JS Console / Redux Dev Tools you can provide an optional name to the `setState` function:

```ts
this.setState({selectedTodoId: id}, 'selectTodo');
```
