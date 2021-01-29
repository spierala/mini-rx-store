---
id: effects
title: Effects
slug: /effects
---

Effects trigger side effects like API calls and handle the result:

-   An Effect listens for a specific action
-   That action triggers the actual side effect
-   The Effect needs to return a new action as soon as the side effect completed

```ts
import { actions$, ofType } from 'mini-rx-store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ProductActionTypes } from './todo-actions';

store.effect(
    actions$.pipe(
        ofType(ProductActionTypes.Load),
        mergeMap(() =>
            productApiService.getProducts().pipe(
                map(products => (new LoadSuccess(products))),
                catchError(err => of(new LoadFail(err)))
            )
        )
    )
);
```

The code above creates an Effect. As soon as the `Load` action has been dispatched the API call (`productService.getProducts()`) will be executed. Depending on the result of the API call a new action will be dispatched:
`LoadSuccess` or `LoadFail`.
