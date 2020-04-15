[![npm version](https://badge.fury.io/js/mini-rx-store.svg)](https://www.npmjs.com/package/mini-rx-store)
[![Tests](https://github.com/spierala/mini-rx-store/workflows/Tests/badge.svg)](https://github.com/spierala/mini-rx-store/actions?query=workflow%3ATests)

# MiniRx: The Lightweight RxJS Redux Store

**MiniRx Store** provides Reactive State Management for Javascript Applications.

**Attention**: MiniRx is currently in beta phase. The API might still change.

If you have a bug or an idea, feel free to open an issue on GitHub.

## Redux

MiniRx uses the Redux Pattern to make state management easy and predictable.

The Redux Pattern is based on this 3 key principles:

-   Single source of truth (the Store)
-   State is read-only and is only changed by dispatching actions
-   Changes are made using pure functions called reducers

## MiniRx Features

-   Minimal configuration and setup
-   MiniRx is lightweight - check the [source code](https://github.com/spierala/mini-rx-store/blob/master/projects/mini-rx-store/src/lib) :)
-   Advanced "Redux / NgRx Store" API:
    Although being a lightweight library, MiniRx supports many of the core features from the popular [@ngrx/store](https://ngrx.io/guide/store) library for Angular:
    _ Actions
    _ Reducers
    _ Memoized Selectors
    _ Effects
-   Simplified API for basic state management per feature... You can update state without writing Actions and Reducers! This API operates directly on the feature state:
    -   `setState()` to update the feature state
    -   `select()` to read feature state
    -   `createEffect()` create an effect with a minimum amount of code
-   The [source code](https://github.com/spierala/mini-rx-store/blob/master/projects/mini-rx-store/src/lib) is easy to understand if you know some RxJS :)
-   [RxJS](https://github.com/ReactiveX/rxjs) is the one and only (peer) dependency
-   Support for [Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension)
-   Framework agnostic: Works with any front-end project built with JavaScript or TypeScript (Angular, React, Vue, or anything else)

## When should you use MiniRx?

-   If you have a small or medium sized application.
-   If you tried to manage state yourself (e.g. with [Observable Services](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)) and you created state soup :)
-   If you have the feeling that your app is not big / complex enough to justify a full-blown state management solution like NgRx then MiniRx is an easy choice.

## Usage

#### Installation:

`npm i mini-rx-store`

#### Create the Store (App State):

The `Store` is created and ready to use as soon as you import `Store`.

`import { Store } from 'mini-rx-store';`

#### Create a Feature (Feature State):

A `Feature` holds a piece of state which belongs to a specific feature in your application (e.g. 'products', 'users').
The Feature States together form the App State (Single Source of Truth).

```
import { Store } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './state/product.reducer';
...
// Inside long living Module / Service
constructor() {
    Store.feature<ProductState>('products', initialState, reducer);
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

Usually you would create a new `Feature` inside long living Modules/Services.

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
import { Store } from 'mini-rx-store';
import { CreateProduct } from 'product.actions';

Store.dispatch(new CreateProduct(product));
```

#### Write an effect:

Effects handle code that triggers side effects like API calls:

-   An Effect listens for a specific Action
-   That Action triggers the actual side effect
-   The Effect needs to return a new Action as soon as the side effect finished

```
import { Action, actions$, ofType } from 'mini-rx-store';
import { LoadFail, LoadSuccess, ProductActionTypes } from './product.actions';
import { ProductService } from '../product.service';

constructor(private productService: ProductService) {
    Store.createEffect(
        actions$.pipe(
            ofType(productActions.ProductActionTypes.Load),
            mergeMap(() =>
                this.productService.getProducts().pipe(
                    map(products => (new LoadSuccess(products))),
                    catchError(err => of(new LoadFail(err)))
                )
            )
        )
    );
}
```

The code above creates an Effect. As soon as the `Load` Action is dispatched the API call (`this.productService.getProducts()`) will be executed. Depending on the result of the API call a new Action will be dispatched:
`LoadSuccess` or `LoadFail`.

#### Create Selectors:

Selectors are used to select and combine state.

```
import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { ProductState } from './product.reducer';

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);
```

`createSelector` creates a memoized selector. This improves performance especially if your selectors perform expensive computation.
If the selector is called with the same arguments again, it will just return the previously calculated result.

#### Select Observable State (with a selector):

```
import { Store } from 'mini-rx-store';
import { getProducts } from '../../state';

this.products$ = Store.select(getProducts);
```

`select` runs the selector on the App State and returns an Observable which will emit as soon as the _products_ data changes.

## Make simple things simple - The `Feature` API

If a Feature in your application requires only simple state management, then you can fall back to a simplified API: With the `Feature` API you can update state without writing Actions and Reducers.

#### Create a Feature (Feature State):

To create a Feature, you need to extend MiniRx's `Feature` class, passing the feature name as well as its initial state.

```
export class UserStateService extends Feature<UserState>{
    constructor() {
        super('users', initialState);
    }
}
```

#### Select state with `select`

**`select(mapFn: ((state: S) => any)): Observable<any>`**

Example:

```
maskUserName$: Observable<boolean> = this.select(state => state.maskUserName);
```

`select` takes a callback function which gives you access to the current feature state (see the `state` parameter).
Inside of that function you can pick a certain piece of state.
The returned Observable will emit the selected data over time.

#### Update state with `setState`

**`setState(stateFn: (state: S) => S | state: Partial<S>): void`**

Example:

```
// Pass callback to setState
updateMaskUserName(maskUserName: boolean) {
    this.setState((state) => {
        return {
            ...state,
            maskUserName
        }
    });
}

// Or pass the new state object directly (in case the current state is not needed to calculate the new state)
updateMaskUserName(maskUserName: boolean) {
    this.setState({maskUserName});
}
```

`setState` takes also a callback function which gives you access to the current feature state (see the `state` parameter).
Inside of that function you can compose the new feature state.

Alternatively `setState` accepts a new state object directly.

#### Create an Effect with `createEffect`

**`createEffect<PayLoadType>(effectFn: (payload: Observable<PayLoadType>) => Observable<(state: S) => S | state: Partial<S>>, effectName?: string ): (payload?: PayLoadType) => void`**

Example:

```
deleteProductFn = this.createEffect<number>(
    payload$ => payload$.pipe(
        mergeMap((productId) => {
            return this.productService.deleteProduct(productId).pipe(
                map(() => state => { // Return callback which calculates the new state
                    return {
                        ...state,
                        products: state.products.filter(product => product.id !== productId),
                        error: ''
                    }
                }),
                catchError(err => of({error: err})) // Or return the new state object directly
            )
        })
    ),
    'delete' // Used for logging / Redux Dev Tools
);

// Run the effect
deleteProductFn(123);
```

The code above creates an Effect for _deleting a product_ from the list. The API call `this.productService.deleteProduct(productId)` is the side effect which needs to be performed.
`createEffect` returns a function which can be called later to start the Effect with an optional payload (see `deleteProductFn(123)`).

`createEffect` takes 2 arguments:

-   **`effectFn: (payload$: Observable<PayLoadType>) => Observable<(state: S) => S | state: Partial<S>>`**:
    Within the `effectFn` you can access the `payload$` Observable.
    That Observable emits as soon as the Effect has started (e.g. by calling `deleteProductFn(123)`).
    You can directly `pipe` on the `payload$` Observable to access the payload value and do the usual RxJS things to run the actual Side Effect (`mergeMap`, `switchMap` etc).
    When the side effect completed you can directly return the new state or return a callback function which gets the current state and returns a new state.

-   **`effectName: string`**:
    ID which needs to be unique per feature. That ID will also show up in the logging (Redux Dev Tools / JS console).

#### FYI

Also the `Feature` API makes use of Redux:
Each Feature is registered in the Store (Single Source of Truth) and is part of the global App State.
Behind the scenes `Feature` is creating a default reducer, and a default action in order to update the feature state.
When you use `setState()` or when the feature´s effect completed, then MiniRx dispatches the default action, and the default reducer will update the feature state accordingly.

See the default Action in the Redux Dev Tools:

![Redux Dev Tools for MiniRx](.github/images/default-action.gif)

## Settings

#### Enable Logging of Actions and State Changes in the Browser Console:

```
import { Store } from 'mini-rx-store';

Store.settings = {enableLogging: true};
```

The code above sets the global Store Settings.
`enableLogging` is currently the only available setting.
Typically you would set the settings when bootstrapping the app and before the store is used.

## Redux Dev Tools (experimental):

![Redux Dev Tools for MiniRx](.github/images/redux-dev-tools.gif)

MiniRx has basic support for the Redux Dev Tools (you can time travel and inspect the current state).
You need to install the Browser Plugin to make it work.

-   [Chrome Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
-   [Firefox Redux Dev Tools](https://addons.mozilla.org/nl/firefox/addon/reduxdevtools/)

#### Installation (Angular):

`npm i mini-rx-ng-devtools`

#### Add DevTools to Angular

```
import { NgReduxDevtoolsModule } from 'mini-rx-ng-devtools';

@NgModule({
    imports: [
        NgReduxDevtoolsModule
    ]
    ...
})
export class AppModule {}
```

#### If you do not use Angular

```
import { Store, ReduxDevtoolsExtension } from 'mini-rx-store';

Store.addExtension(new ReduxDevtoolsExtension());
```

## Showcase

This Repo contains also an Angular showcase project.

Run `npm i`

Run `ng serve mini-rx-store-showcase --open` to see MiniRx in action.

The showcase is based on the NgRx example from Deborah Kurata: https://github.com/DeborahK/Angular-NgRx-GettingStarted/tree/master/APM-Demo5

I did a refactor from NgRx to MiniRx and the app still works :)

## References

These projects and articles helped and inspired me to create MiniRx:

-   [NgRx](https://ngrx.io/)
-   [Observable Store](https://github.com/DanWahlin/Observable-Store)
-   [RxJS Observable Store](https://github.com/jurebajt/rxjs-observable-store)
-   [Basic State Managment with an Observable Service](https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8)
-   [Redux From Scratch With Angular and RxJS](https://www.youtube.com/watch?v=hG7v7quMMwM)
-   [How I wrote NgRx Store in 63 lines of code](https://medium.com/angular-in-depth/how-i-wrote-ngrx-store-in-63-lines-of-code-dfe925fe979b)

## TODO

-   Further Integrate Redux Dev Tools
-   Work on the ReadMe and Documentation
-   Nice To Have: Test lib in React, Vue, maybe even AngularJS
-   Add Unit Tests

## License

MIT

## Created By

If you like this, follow [@spierala](https://twitter.com/spierala) on twitter.
