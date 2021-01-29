---
id: ts-action
title: ts-action
slug: /ts-action
---
MiniRx supports writing and consuming actions with [ts-action](https://www.npmjs.com/package/ts-action) to reduce boilerplate code.

There are also [ts-action-operators](https://www.npmjs.com/package/ts-action-operators) to consume actions in Effects.

Install the packages using npm:

`npm install ts-action ts-action-operators`

#### Create an Action:

```ts
import { action, payload } from 'ts-action';

const addTodo = action('Add Todo', payload<string>());
```

#### Dispatch an Action:

```ts
store.dispatch(addTodo('Use Redux'))
```

#### Reducer

```ts
import { on, reducer } from 'ts-action';

const initialState = {
    todos: []
}

const todoReducer = reducer(
    initialState,
    on(addTodo, (state, {payload}) => ({...state, todos: [...state.todos, payload]}))
);
```

#### Effects

Consume actions in Effects

```ts
import { actions$ } from 'mini-rx-store';
import { ofType, toPayload } from 'ts-action-operators';
import { mergeMap, map, catchError } from 'rxjs/operators';

updateProduct$ = actions$.pipe(
    ofType(updateProduct),
    toPayload(),
    mergeMap((product) => {
        return this.productService.updateProduct(product).pipe(
            map(updatedProduct => (updateProductSuccess(updatedProduct))),
            catchError(err => of(updateProductFail(err)))
        );
    })
);
```
