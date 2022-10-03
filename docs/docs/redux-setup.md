---
id: redux-setup
title: Redux Setup
---

With `configureStore` we get hold of the global store object. 
At the same time we can pass a configuration to initialize our feature reducers, meta reducers, initial state and extensions.

## No Setup
At first, we do not need any configuration to get started.

Let`s just get hold of the store instance:
```ts
import { configureStore, Store } from 'mini-rx-store';

const store: Store = configureStore({});
```

With the `Store` instance we can already add reducers (dynamically), select state, dispatch actions and create effects.

## Feature Reducers
We can configure the feature reducers via the configuration object. The reducers will be ready at store initialization.

```ts
import { configureStore, Store } from 'mini-rx-store';
import productReducer from './product-reducer';
import userReducer from './user-reducer';

const store: Store = configureStore({
  reducers: {
    product: productReducer,
    user: userReducer
  }
});
```

### Add Feature Reducers dynamically
It is possible to add feature reducers dynamically later like this:
```ts
import todoReducer from './todo-reducer';

store.feature('todo', todoReducer);
```

## Initial State
We can set the initial state of the store via the configuration object. The initial state keys must match the provided reducer keys:
```ts
import { configureStore, Store } from 'mini-rx-store';
import { productReducer } from './product-reducer';
import { userReducer } from './user-reducer';

const store: Store = configureStore({
  reducers: {
    product: productReducer,
    user: userReducer
  },
  initialState: {
    product: {},
    user: {}
  }
});
```
See how the initial state is available in a feature reducer:
```ts
import { Action, Store, configureStore } from 'mini-rx-store';

interface CounterState {
  count: number;
}

// Reducer
function counterReducer(state: CounterState, action: Action): CounterState {
  switch (action.type) {
    case 'inc':
      return {
        ...state,
        count: state.count + 1
      };
    default:
      return state;
  }
}

// Configure the store
const store: Store = configureStore({
  reducers: {
    counter: counterReducer
  },
  initialState: {
    counter: {count: 123} 
  }
});

// Select global state
store.select(state => state).subscribe(console.log);
// OUTPUT: {'counter':{'count':123}}

// Dispatch the 'increment' action
store.dispatch({ type: 'inc' });
// OUTPUT: {'counter':{'count':124}}
```

## Meta reducers
Meta reducers are executed before the "normal" feature reducers.
With meta reducers we can pre-process actions and state.

:::info
Most MiniRx Extensions like the Undo Extension, Logger Extension or the Immutable Extension are implemented with a meta reducer.
:::info

A meta reducer is a function which takes a reducer and returns a new reducer.

Let's see how to implement a simple Debug meta reducer:

```ts
export function debug(reducer) {
  return function newReducer(state, action) {
    const nextState = reducer(state, action);
    console.log('state', state);
    console.log('action', action);
    console.log('next state', nextState);
    return nextState;
  }
}
```
Now we can add the `debug` meta reducer to the `metaReducers` array of the configuration object:
```ts
const store: Store = configureStore({
  // reducers: {...},
  // initialState: {...},
  metaReducers: [debug]
});
```
You can add many meta reducers to the array. The meta reducers will be executed from "left to right".
