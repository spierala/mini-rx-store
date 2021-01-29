---
id: actions
title: Actions
sidebar_label: Actions
slug: /actions
---

Actions represent unique events in our application. Reducer functions will process the actions in order to update state.

An action is a simple object with a `type` property:

```ts
import { Action } from 'mini-rx-store';

const addTodo: Action = {
    type: 'ADD_TODO', 
    payload: 'Use Redux' // Optional Payload
}
```
Now we can dispatch the `addReduxTodo` action to the Store and let the reducers calculate the new global state.

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
    payload
  }
}
```
Dispatch the action:
```ts
store.dispatch(addTodo('Use Redux'))
```


### Class-based Action Creators (TypeScript)
```ts title="todo-actions.ts"
import { Action } from 'mini-rx-store';

enum TodoActionTypes {
    AddTodo = 'Add Todo',
    RemoveTodo = 'Remove Todo',
}

class AddTodo implements Action {
  readonly type = TodoActionTypes.AddTodo;
  constructor(public payload: string) { }
}

class RemoveTodo implements Action {
    readonly type = TodoActionTypes.RemoveTodo;
    constructor(public payload: string) { }
}

// Union the valid types
type TodoActions = AddTodo | RemoveTodo;
```

Dispatch the action:
```ts
store.dispatch(new CreateProduct(product))
```

The following code examples use Class-based Action Creators.
