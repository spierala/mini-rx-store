---
id: reducers
title: Reducers
slug: /reducers
---

Reducers specify how the feature state changes in response to actions sent to the store. A reducer function typically looks like this:

```ts title="todo-reducer.ts"
import { TodoActionTypes, TodoActions } from './todo-actions';

export interface TodoState {
    todos: string[];
}

const initialState: TodoState = {
    todos: []
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

        default:
            return state;
    }
}
```

### Register feature reducer
Before we can update state by dispatching actions, we need to add the reducer to the Store.
There are 2 options to register a feature reducer:
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

#### Option 2: Add feature reducer dynamically
We can add feature reducers at any time with `store.feature`.

```ts
import todoReducer from './todo-reducer';

store.feature('todo', todoReducer)
```
### Update State
Now we are all set for updating the *todos* feature state.
Let's dispatch the `AddTodo` action:
```ts
store.dispatch(new AddTodo('Use Redux'));

store.select(state => state).subscribe(console.log); // Log: {"todo":{"todos":["Use Redux"]}}
```
Yes, we did it! The todoReducer processed the action and the new todo landed in the `todos` array.
