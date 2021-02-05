---
id: actions
title: Actions
sidebar_label: Actions
slug: /actions
---

Actions represent unique events in our application. Reducer functions will process the actions in order to update state.

An action is a simple object with a `type` property:

```ts
const addTodo = {
    type: 'ADD_TODO',
    // Besides `type`, the structure of an action object is really up to you.
    payload: 'Use Redux' 
}
```
Now we can dispatch the `addTodo` action to the Store and let the reducers calculate the new global state.

```ts
store.dispatch(addTodo);
```

## Action Creators
Of course, we do not want to create these action objects by hand when we need to dispatch an action.
Action creators will do the repetitive work for us.

### "Classic" Action Creators
```ts
export function addTodo(payload) {
    return {
        type: 'ADD_TODO',
        title: string
    }
}
```
Dispatch the action:
```ts
store.dispatch(addTodo({id: '1', name: 'Use Redux'}));
```


### Class-based Action Creators (TypeScript)
```ts title="todo.ts"
export interface Todo {
    id: string,
    name: string
}
```

```ts title="todo-actions.ts"
import { Action } from "mini-rx-store";
import { Todo } from "./todo";

export enum TodoActionTypes {
    AddTodo = "ADD_TODO",
    RemoveTodo = "REMOVE_TODO"
}

export class AddTodo implements Action {
    readonly type = TodoActionTypes.AddTodo;
    constructor(public payload: Todo) {}
}

export class RemoveTodo implements Action {
    readonly type = TodoActionTypes.RemoveTodo;
    constructor(public payload: string) {}
}

// Union the valid types
export type TodoActions = AddTodo | RemoveTodo;
```

Dispatch the actions:
```ts
store.dispatch(new AddTodo({id: '1', title: 'Use Redux'}));

store.dispatch(new RemoveTodo('1'))
```

The following code examples use Class-based Action Creators.
