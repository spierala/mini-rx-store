# Mini Rx Store

Minimalistic and lightweight Redux Store based on RxJS.

**Mini Rx Store** provides Reactive State Management for Javascript Applications.

## Showcase

Run `npm i`

Run `ng serve mini-rx-store-showcase --open` to see MiniRX in action. 

The showcase is based on the NgRX example from Deborah Kurata: https://github.com/DeborahK/Angular-NgRx-GettingStarted/tree/master/APM-Demo5

I did a refactor from NgRX to MiniRX and the app still works :)

The lib itself lives in [projects/mini-rx-store/src/lib](https://github.com/spierala/mini-rx-store/tree/master/projects/mini-rx-store/src/lib)

The lib is still a **work in progress** and should **not** yet be used in production.
I will publish the lib to npm as soon as it is more thoroughly tested.
The API might still change till then.

Please let me know if you have ideas for improvement.

## Features
Although being minimalistic, MiniRX supports many of the core Redux principles from the NgRX library for Angular:
* Actions
* Reducer
* Memoized Selectors
* Effects

The API of MiniRX is very similar to NgRX.
If you realize during the project to need the full blown state management from [NgRX](https://ngrx.io/guide/store) then a refactor from MiniRX to NgRX would be very easy. 

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
import { Action, actions$, ofType } from 'mini-rx-store';

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
* Work on the ReadMe and Documentation
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
* Add Unit Tests
* Expose NgModule for easier Angular Integration
* Publish lib to npm
