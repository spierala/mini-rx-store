[![npm version](https://badge.fury.io/js/mini-rx-store.svg)](https://www.npmjs.com/package/mini-rx-store)

# MiniRx: The Lightweight RxJS Redux Store

**MiniRx Store** provides Reactive State Management for Javascript Applications.

**Attention**: MiniRx is currently in beta phase. The API might still change. 

If you have a bug or an idea, feel free to open an issue on GitHub.

## Redux
MiniRx uses the Redux Pattern to make state management easy and predictable.
The Redux Pattern is based on this 3 key principles:
* Single source of truth (the store)
* State is read-only and is only changed by dispatching actions
* Changes are made using pure functions called reducers

## Features

* Minimal configuration and setup
* MiniRx is lightweight - check the source code :)
* Advanced "Redux / NgRx" API:
Although being a lightweight library, MiniRx supports many of the core features from the popular [NgRx](https://ngrx.io/) library for Angular:
    * Actions
    * Reducers
    * Memoized Selectors
    * Effects
* Simplified "shortcut" API for basic state management per feature... You can update state without writing Actions and Reducers! This API operates directly on the feature state: 
    * `setState()` to update the feature state
    * `select()` to read feature state
    * `createMiniEffect()` create an effect with a minimum amount of code
* The source code is easy to understand if you know some RxJS :)
* [RxJS](https://github.com/ReactiveX/rxjs) is the one and only (peer) dependency
* Support for [Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension)
* Framework agnostic: Works with any front-end project built with JavaScript or TypeScript (Angular, React, Vue, or anything else)

## When should you use MiniRx?

* If you have a small or medium sized application.
* If you tried to manage state yourself (e.g. with [Observable Services](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)) and you created state soup :)
* If you have the feeling that your app is not big / complex enough to justify a full-blown state management solution like NgRx then MiniRx is an easy choice.

## Usage
#### Installation:

`npm i mini-rx-store`

#### Create the MiniStore (App State):
The `MiniStore` is created and ready to use as soon as you import MiniStore.

```import { MiniStore } from 'mini-rx-store';```

#### Create a MiniFeature (Feature State):
A `MiniFeature` holds a piece of state which belongs to a specific feature in your application (e.g. 'products', 'users').
The Feature States together form the App State (Single Source of Truth).
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
Its initial state is set and the reducer function defines how the feature state changes along with an incoming Action.

Initial state example:
```
export const initialState: ProductState = {
  showProductCode: true,
  products: [],
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

#### Create an Action:
```
export enum ProductActionTypes {
  CreateProduct = '[Product] Create Product',
} 

export class CreateProduct implements Action {
  readonly type = ProductActionTypes.CreateProduct;
  constructor(public payload: Product) { }
}
``` 

#### Dispatch an Action: 
```
import { MiniStore } from 'mini-rx-store';
import { CreateProduct } from 'product.actions';

MiniStore.dispatch(new CreateProduct(product));
```

#### Write an effect: 
Effects handle code that triggers side effects like API calls: 
* An Effect listens for a specific Action
* That Action triggers the actual side effect
* The Effect needs to return a new Action

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

You need to register the Effect before the corresponding Action is dispatched.
#### Register one or many effects: 
```
MiniStore.effects([loadProducts$]);
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
`createSelector` creates a memoized selector. This improves performance especially if your selectors perform expensive computation.
If the selector is called with the same arguments again, it will just return the previously calculated result. 

#### Select Observable State (with a selector): 
```
import { MiniStore } from 'mini-rx-store';
import { getProducts } from '../../state';

this.products$ = MiniStore.select(getProducts);
```
`select` runs the selector on the App State and returns an Observable which will emit as soon as the _products_ data changes. 

## Make simple things simple - The `MiniFeature` API 
If a Feature in your application requires only simple state management, then you can fall back to a simplified API which is offered for each `MiniFeature` instance (which is returned by the `MiniStore.feature` function)
#### Get hold of the MiniFeature instance
```
private feature: MiniFeature<UserState> = MiniStore.feature<UserState>('users', initialState);
```
#### Select state with `select`
```
maskUserName$: Observable<boolean> = this.feature.select(currState => currState.maskUserName);
```
`select` takes a mapping function which gives you access to the current feature state (see `currState`).
Inside of that function you can pick a certain piece of state.
The returned Observable will emit the selected data over time. 
#### Update state with `setState`
```
updateMaskUserName(maskUserName: boolean) {
    this.feature.setState((currState) => {
        return {
            ...currState,
            maskUserName
        }
    });
}
```
`setState` takes also a mapping function which gives you access to the current feature state (see `currState`).
Inside of that function you can compose the new feature state.

#### Create an MiniEffect with `createMiniEffect`
```
deleteProductFn = this.feature.createMiniEffect<number>(
    'delete',
    payload$ => payload$.pipe(
        mergeMap((productId) => {
            return this.productService.deleteProduct(productId).pipe(
                map(() => new this.feature.SetStateAction(currState => {
                    return {
                        ...currState,
                        products: state.products.filter(product => product.id !== productId),
                        currentProductId: null,
                        error: ''
                    }
                })),
                catchError(err => of(new this.feature.SetStateAction(currState => {
                    return {
                        ...currState,
                        error: err
                    };
                })))
            )
        })
    )
);

// Run the effect
deleteProductFn(123);
```
The code above creates a MiniEffect for _deleting a product_ from the list. Therefore this API call `this.productService.deleteProduct(productId)` needs to be performed.
`createMiniEffect` returns a function which can be called later with an optional payload to start the MiniEffect. 

`createMiniEffect` takes 2 arguments:
   * `effectName: string`: ID which needs to be unique per feature. That ID will also show up in the logging (Redux Dev Tools / JS console).
   
   * `effectFn: (payload: Observable<PayLoadType>) => Observable<Action>`: With the `effectFn` you can access the `payload` Observable. That Observable is triggered by MiniRx as soon as the Effect is started (e.g. by calling ` deleteProductFn(123)`). 
   You can directly `pipe` on the `payload$` Observable and do the usual RxJS things to run the actual Side Effect (`mergeMap`, `switchMap` etc). 
   
   Also a MiniEffect needs to return a new Action as soon as the Side Effect did its job.
   `effectFn` returns that new Action.
   You can return any Action of type `Action`. Or you can return `this.feature.SetStateAction`... 
   
   `SetStateAction` is available on the `MiniFeature` instance. Use it to update the feature state directly without creating any custom Actions. 
   Its payload is a mapping function which gives you access to the current feature state. Inside of that function you can compose the new feature state. 
   Feature State is updated when the MiniEffect dispatches `SetStateAction`.

### FYI
Behind the scenes the `MiniFeature` creates a default reducer and a default action in order to update the feature state.
When you use `setState()` or dispatch the `SetStateAction` then the default action is dispatched and the default reducer will update the feature state for you.

See the default Action in the Redux Dev Tools:

![Redux Dev Tools for MiniRx](.github/images/default-action.gif)

#### Enable Logging of Actions and State Changes in the Browser Console: 
```
import { MiniStore } from 'mini-rx-store';

MiniStore.settings = {enableLogging: true};
```
The code above sets the global MiniStore Settings.
`enableLogging` is currently the only available setting.
Typically you would set the settings when bootstrapping the app and before the store is used.

#### Redux Dev Tools (experimental):
![Redux Dev Tools for MiniRx](.github/images/redux-dev-tools.gif)

MiniRx has basic support for the Redux Dev Tools (you can time travel and inspect the current state).
You need to install the Browser Plugin to make it work. 

* [Chrome Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
* [Firefox Redux Dev Tools](https://addons.mozilla.org/nl/firefox/addon/reduxdevtools/)

Register the Redux Dev Tools with MiniRx (currently implemented for Angular only):

If you use Angular then you must import `NgReduxDevtoolsModule` from MiniRx to your root/app module.
Behind the scenes it will run `MiniStore.addExtension(new ReduxDevtoolsExtension());` for you, but most importantly it connects the Redux Dev Tools PlugIn with the Angular Change Detection. 
```
import { NgReduxDevtoolsModule } from 'mini-rx-store';

@NgModule({
    imports: [
        NgReduxDevtoolsModule
    ]
    ...
})
export class AppModule {}
```

## Showcase

This Repo contains also an Angular showcase project.

Run `npm i`

Run `ng serve mini-rx-store-showcase --open` to see MiniRx in action. 

The showcase is based on the NgRx example from Deborah Kurata: https://github.com/DeborahK/Angular-NgRx-GettingStarted/tree/master/APM-Demo5

I did a refactor from NgRx to MiniRx and the app still works :)

## References
These projects and articles helped and inspired me to create MiniRx:
* [NgRx](https://ngrx.io/)
* [Observable Store](https://github.com/DanWahlin/Observable-Store)
* [RxJS Observable Store](https://github.com/jurebajt/rxjs-observable-store)
* [Basic State Managment with an Observable Service](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)
* [Redux From Scratch With Angular and RxJS](https://www.youtube.com/watch?v=hG7v7quMMwM)
* [How I wrote NgRx Store in 63 lines of code](https://medium.com/angular-in-depth/how-i-wrote-ngrx-store-in-63-lines-of-code-dfe925fe979b)

## TODO
* Further Integrate Redux Dev Tools
* Work on the ReadMe and Documentation
* Nice To Have: Test lib in React, Vue, maybe even AngularJS
* Add Unit Tests

## License
MIT

## Created By
If you like this, follow [@spierala](https://twitter.com/spierala) on twitter.
