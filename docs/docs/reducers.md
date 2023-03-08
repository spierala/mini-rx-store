---
id: reducers
title: Reducers
slug: /reducers
---

Reducers specify how the feature state changes in response to actions sent to the store. 
A reducer function typically looks like this:

```ts title="todo-reducer.ts"
import { Todo } from './todo';
import { TodoActionTypes, TodoActions } from './todo-actions';

export interface TodoState {
  todos: Todo[];
  selectedTodoId: number
}

export const initialState: TodoState = {
  todos: [],
  selectedTodoId: undefined
};

export function todoReducer(
  state: TodoState = initialState,
  action: TodoActions
): TodoState {
  switch (action.type) {
    case TodoActionTypes.AddTodo:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case TodoActionTypes.RemoveTodo:
      return {
        ...state,
        todos: state.todos.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}
```

### Register feature reducer
Before we can update state by dispatching actions, we need to add the reducer to the store.
There are two options to register a feature reducer:
#### Option 1: Store Config
```ts
import { configureStore, Store } from 'mini-rx-store';
import todoReducer from './todo-reducer';

const store: Store = configureStore({
  reducers: {
    todo: todoReducer
  }
});
```

Like this, the reducers are ready when the store is initialized.

#### Option 2: Add feature reducers dynamically
We can add feature reducers at any time with `store.feature`.

```ts
import todoReducer from './todo-reducer';

store.feature('todo', todoReducer)
```
### Update State
Now we are all set for updating the *todos* feature state.
Let's dispatch the `AddTodo` action:
```ts
store.dispatch(new AddTodo({id: 1, title: 'Use Redux'}));

store.select(state => state).subscribe(console.log); 
// Output: {"todo":{"todos":[{id: 1, title: "Use Redux"}]}}
```
Yes, we did it! The todoReducer processed the action, and the new todo landed in the `todos` array.
