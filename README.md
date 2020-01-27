# MiniRxStore

Minimalistic and lightweight Redux Store based on RxJS

## Showcase

Run `ng serve mini-rx-store-showcase` for a dev server.

Navigate to `http://localhost:4200/` to see `mini-rx-store` in action. 

The showcase is based on the NgRX example from Deborah Kurata: https://github.com/DeborahK/Angular-NgRx-GettingStarted/tree/master/APM-Demo5

I did a refactor from NgRX to `mini-rx-store` and the app still works :)

The lib itself lives in [projects/mini-rx-store/src/lib](https://github.com/spierala/mini-rx-store/tree/master/projects/mini-rx-store/src/lib)

The lib is still a **work in progress** and should **not** yet be used in production.
I will publish to npm as soon as I think that the lib is stable enough.
Please let me know if you see possible improvements.

## Features
Although being minimalist, `mini-rx-store` supports many of the core Redux principles from the NgRX library for Angular:
* Actions
* Reducer
* Memoized Selectors
* Effects

### Usage (in Angular)
Create a feature store (with registering the reducer function and optional effects):
```
import { FeatureStore } from 'mini-rx-store';
import { ProductEffects } from './product.effects';
...
export class ProductStoreService extends FeatureStore<ProductState, ProductActions> {
    constructor(
    productEffects: ProductEffects
    ) {
    super('products', reducer, productEffects.effects$);
    }
}
```

Write an effect: 
```
private loadProducts$: Observable<Action> = actions$.pipe(
    ofType(productActions.ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
      )
    )
);
```
Create Selectors:
```
import { createFeatureSelector, createSelector } from 'mini-rx-store';

const getProductFeatureState = createFeatureSelector('products');

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);
``` 
 
Dispatch an Action: 
```
import { MiniStore } from 'mini-rx-store';
MiniStore.dispatch(new productActions.CreateProduct(product));
```

Select Observable State: 
```
import { MiniStore } from 'mini-rx-store';
this.products$ = MiniStore.select(getProducts);
```

## TODO
* Integrate Redux Dev Tools
* Add Action Creator Functions
* Work on the ReadMe and Documentation :)
* Publish lib to npm
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
