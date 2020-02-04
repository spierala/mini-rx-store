# MiniRx: Lightweight RxJS Redux Store

**MiniRx Store** provides Reactive State Management for Javascript Applications.

## Features

* Minimal configuration and setup
* Simplified API for basic state management per feature: 
    * `setState()` for updating the feature state, 
    * `$state` for accessing the current feature state
* Advanced "Redux / NgRX" API:
Although being a lightweight library, MiniRX supports many of the core features from the popular [NgRX](https://ngrx.io/) library for Angular:
    * Actions
    * Reducers
    * Memoized Selectors
    * Effects
* MiniRX is lightweight - check the source code :)
* The source code is easy to understand if you know some RxJS :)
* RxJS is the one and only (peer) dependency
* Framework agnostic

### Usage (in Angular)
####Create the MiniStore (App State):
You have to do nothing :)
The `MiniStore` is created as soon as you create the first `MiniFeature`... (see next section).

####Create a MiniFeature (Feature State):
A `MiniFeature` holds a piece of state which belongs to a specific feature in your application (e.g. 'products', 'users').
The FeatureState lives inside the AppState.
```
import { MiniStore } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './state/product.reducer';
...
export class ProductStoreService {
    constructor() {
      MiniStore.feature<ProductState>('products', initialState, reducer);
    }
}
```
The code above creates a new feature state for _products_.
Its initial state is set and the reducer function defines how the feature state changes with an incoming Action.

A reducer function looks like this:
```
export function reducer(state: ProductState, action: ProductActions): ProductState {
  switch (action.type) {
    case ProductActionTypes.ToggleProductCode:
      return {
        ...state,
        showProductCode: action.payload
      };

    default:
      return state;
  }
}
```


Usually you would create a new `MiniFeature` inside long living Modules/Services.

#### Write an effect: 
Effects handle code that triggers side effects like API calls.
```
import { Action, actions$, ofType } from 'mini-rx-store';
import { LoadFail, LoadSuccess, ProductActionTypes } from './product.actions';

private loadProducts$: Observable<Action> = actions$.pipe(
    ofType(ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new LoadSuccess(products))),
        catchError(err => of(new LoadFail(err)))
      )
    )
);
```
The code above creates an Effect. As soon as the `Load` Action is dispatched the API call (`this.productService.getProducts()`) will be executed. Depending on the result of the API call a new Action will be dispatched:
`LoadSuccess` or `LoadFail`.

You need to register the effect before it can take action... (see next section).
#### Register one or many effects: 
```
MiniStore.effects([loadProducts$]);
```
 
#### Dispatch an Action: 
```
import { MiniStore } from 'mini-rx-store';
import { CreateProduct } from 'product.actions';

MiniStore.dispatch(new CreateProduct(product));
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
import { getProducts } from '../../state';

this.products$ = MiniStore.select(getProducts);
```

#### Make simple things simple: 
If a Feature in your application requires only simple state management, then you can fall back to a simplified API which is offered for each `MiniFeature` instance returned by `MiniStore.feature()`
```
private feature: MiniFeature<UserState> = MiniStore.feature<UserState>('users', initialState);

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
Behind the scenes the `MiniFeature` creates a default reducer and a default action. When you use `setState()` then the default action is dispatched the default reducer will update the feature state for you.

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

## TODO
* Integrate Redux Dev Tools
* Work on the ReadMe and Documentation
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
* Add Unit Tests
* Expose NgModule for easier Angular Integration
* Publish lib to npm
