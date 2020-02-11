# MiniRx: The Lightweight RxJS Redux Store

**MiniRx Store** provides Reactive State Management for Javascript Applications.

**Attention**: MiniRx is currently in public beta. The API might still change. 

If you have a bug or an idea, feel free to open an issue on GitHub.

## Features

* Minimal configuration and setup
* Simplified API for basic state management per feature: 
    * `setState()` for updating the feature state, 
    * `$state` for accessing the current feature state
* Advanced "Redux / NgRx" API:
Although being a lightweight library, MiniRx supports many of the core features from the popular [NgRx](https://ngrx.io/) library for Angular:
    * Actions
    * Reducers
    * Memoized Selectors
    * Effects
* MiniRx is lightweight - check the source code :)
* The source code is easy to understand if you know some RxJS :)
* RxJS is the one and only (peer) dependency
* Framework agnostic

## When should you use MiniRx?

* If you have a small or medium sized application.
* If you tried to manage state yourself (e.g. with [Observable Services](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)) and you created state soup :)
* If you have the feeling that your app is not big / complex enough to justify a full-blown state management solution like NgRx then MiniRx is an easy choice.

### Usage
#### Installation:

`npm i mini-rx-store`

#### Create the MiniStore (App State):
The `MiniStore` is created and ready to use as soon as you import MiniStore.

```import { MiniStore } from 'mini-rx-store';```

#### Create a MiniFeature (Feature State):
A `MiniFeature` holds a piece of state which belongs to a specific feature in your application (e.g. 'products', 'users').
The Feature States live inside the AppState.
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

Initial state example:
```
export const initialState: ProductState = {
  showProductCode: true,
  currentProductId: null,
  products: [],
  error: ''
};
```

A reducer function typically looks like this:
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
If a Feature in your application requires only simple state management, then you can fall back to a simplified API which is offered for each `MiniFeature` instance (returned by the `MiniStore.feature` function)
```
private feature: MiniFeature<UserState> = MiniStore.feature<UserState>('users', initialState);

// get state via the state$ Observable
// use th RxJS map operator to get a specific piece of the feature state
maskUserName$: Observable<boolean> = this.feature.state$.pipe(map(state => state.maskUserName));

updateMaskUserName(maskUserName: boolean) {
    // Update State
    this.feature.setState((currState) => {
        return {
            ...currState,
            maskUserName
        }
    });
}
```
`state$` is an Observable which will emit the current state of the feature.

`setState` takes a function which specifies how the feature state is supposed to be updated. That function has access to the current state of the feature (see `currState` parameter). 

Behind the scenes the `MiniFeature` creates a default reducer and a default action. When you use `setState()` then the default action is dispatched the default reducer will update the feature state for you.

#### Enable Logging of Actions and State Changes in the Browser Console: 
```
import { MiniStore } from 'mini-rx-store';

MiniStore.settings = {enableLogging: true};
```
The code above sets the global MiniStore Settings.
`enableLogging` is currently the only available setting.
Typically you would set the settings when bootstrapping the app and before the store is used.

## Showcase

The [MiniRx GitHub Repo](https://github.com/spierala/mini-rx-store) contains also an Angular showcase project.

Run `npm i`

Run `ng serve mini-rx-store-showcase --open` to see MiniRX in action. 

The showcase is based on the NgRx example from Deborah Kurata: https://github.com/DeborahK/Angular-NgRx-GettingStarted/tree/master/APM-Demo5

I did a refactor from NgRx to MiniRx and the app still works :)

## References
These projects and articles helped and inspired me to create MiniRx:
* [NgRx](https://ngrx.io/)
* [Observable Store](https://github.com/DanWahlin/Observable-Store)
* [RxJS Observable Store](https://github.com/jurebajt/rxjs-observable-store)
* [Basic State Managment with an Observable Service](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)
* [Redux From Scratch With Angular and RxJS](https://angularfirebase.com/lessons/redux-from-scratch-angular-rxjs/)
* [How I wrote NgRx Store in 63 lines of code](https://medium.com/angular-in-depth/how-i-wrote-ngrx-store-in-63-lines-of-code-dfe925fe979b)

## TODO
* Integrate Redux Dev Tools
* Work on the ReadMe and Documentation
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
* Add Unit Tests
