---
id: redux-setup
title: Setup
---

With `configureStore` we get hold of the global Store object. 
At the same time we can pass a configuration to initialize our Root Reducers, Meta Reducers, initial state and extensions.

## No Setup
At first we do not need any configuration to get started.

Let`s just get hold of the Store instance:

```ts
import { configureStore, Store } from 'mini-rx-store';

const store: Store = configureStore({});
```

We can add feature reducers dynamically later like this:
```ts
import todoReducer from './todo-reducer';

store.feature('todo', todoReducer);
```

## Root Reducers
If we need the feature reducers to be ready at Store initialization then we can pass them with the config object.

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
