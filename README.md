# MiniRx Store: Lightweight RxJS Redux Store

**MiniRx Store** provides Reactive State Management for Javascript Applications.

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

* Requires only minimal configuration or setup
* Lightweight Lib (its only dependency is RxJS)
* Source Code of the Lib is easy to understand if you know some RxJS :)
* Framework agnostic
* Simplified API for basic state management per feature: 
    * `setState()` for updating the feature state, 
    * `$state` for accessing the current feature state
* Advanced "Redux / NgRX" API:
Although being a lightweight library, MiniRX supports many of the core features from the popular [NgRX](https://ngrx.io/) library for Angular:
    * Actions
    * Reducers
    * Memoized Selectors
    * Effects

### Usage (in Angular)
####Create the MiniStore (App State):
You have to do nothing :)
The MiniStore is created as soon as you create the first MiniStore Feature... (see next section).

####Create a MiniStore Feature:
A MiniStore Feature holds a piece of state which belongs to a specific feature in your application (e.g. 'products', 'users').

```
import { MiniStore } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './state/product.reducer';
...
export class ProductStoreService {
    constructor() {
      MiniStore.addFeature<ProductState>('products', initialState, reducer);
    }
}
```

#### Write an effect: 
Effects handle code that triggers side effects like API calls.
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

#### Register one or many effects: 
```
  MiniStore.addEffects([loadProducts$]);
```
 
#### Dispatch an Action: 
```
import { MiniStore } from 'mini-rx-store';
MiniStore.dispatch(new productActions.CreateProduct(product));
```

#### Create Selectors:
Selectors are used to select and combine state. 
```
import { createFeatureSelector, createSelector } from 'mini-rx-store';

const getProductFeatureState = createFeatureSelector('products');

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);
``` 

#### Select Observable State (with a selector): 
```
import { MiniStore } from 'mini-rx-store';
this.products$ = MiniStore.select(getProducts);
```

#### Make simple things simple: 
If a App Feature requires only simple state management, then you can fall back to a simplified API which is offered by each feature instance returned by `MiniStore.addFeature`
```
private feature: Feature<UserState> = MiniStore.addFeature<UserState>('users', initialState);

maskUserName$: Observable<boolean> = this.feature.state$.pipe(map(state => state.maskUserName));

updateMaskUserName(maskUserName: boolean) {
    // Update State
    this.feature.setState((state) => {
        return {
            ...state,
            maskUserName
        }
    });
}
```
Behind the scenes the MiniStore Feature creates a default reducer and a default action. When you use `setState()` then the default action is dispatched the default reducer will update the data for you.

## TODO
* Integrate Redux Dev Tools
* Work on the ReadMe and Documentation
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
* Add Unit Tests
* Expose NgModule for easier Angular Integration
* Publish lib to npm
