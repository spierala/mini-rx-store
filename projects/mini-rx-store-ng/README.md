[![npm version](https://badge.fury.io/js/mini-rx-store-ng.svg)](https://www.npmjs.com/package/mini-rx-store-ng)

# Angular Integration for [MiniRx Store](https://github.com/spierala/mini-rx-store).

Use MiniRx Store the Angular way:
    
- [Configure the store](#register-the-store-in-the-app-module) using `StoreModule.forRoot()`
- [Register Feature States](#register-feature-states-in-angular-feature-modules) using `StoreModule.forFeature()`
- [Register Effects](#register-effects) using `EffectsModule.register()`
- [Use Angular Dependency Injection](#get-hold-of-the-store-and-actions-via-the-angular-dependency-injection) for `Store` and `Actions`
- [Redux Devtools Extension](#redux-dev-tools)

## Usage

### Installation:

`npm i mini-rx-store-ng`

### Register the Store in the App Module
```ts
import { StoreModule } from 'mini-rx-store-ng';

@NgModule({
    imports: [
        StoreModule.forRoot({
            extensions: [
                // Add extensions here
                // new LoggerExtension()
            ],
            reducers: {
                // Add root reducers here
                // user: userReducer
            },
            metaReducers: [
                // Add root meta reducers
            ]
        }),
    ]
})
export class AppModule {}
```

### Register Feature States in Angular Feature Modules

```ts
import { StoreModule } from 'mini-rx-store-ng';

@NgModule({
    imports: [
        StoreModule.forFeature('products', productReducer),
    ]
})
export class ProductModule {
    constructor() {}
}
```

### Register Effects
```ts
// product-effects.service.ts
import { Actions } from 'mini-rx-store';

@Injectable({ providedIn: 'root' })
export class ProductEffects {
    constructor(
        private productService: ProductService, 
        private actions$: Actions
    ) {
    }

    loadProducts$ = this.actions$.pipe(
        ofType(load),
        mergeMap((action) =>
            this.productService.getProducts().pipe(
                map((products) => loadSuccess(products)),
                catchError((err) => of(loadFail(err)))
            )
        )
    );
}    
```
```ts 
// product.module.ts
import { EffectsModule, StoreModule } from 'mini-rx-store-ng';

@NgModule({
    imports: [
        StoreModule.forFeature('products', productReducer),
        EffectsModule.register([ProductEffects]),
    ]
})
export class ProductModule {
    constructor() {}
}
```
The `register` method from the EffectsModule accepts an array of classes with effects and can be used in both, root and feature modules.

### Get hold of the store and actions via the Angular Dependency Injection
After we registered the StoreModule in the AppModule we can use Angular DI to access `Store` and `Actions`.

For example in a component:
```ts
import { Component } from '@angular/core';
import { Store } from 'mini-rx-store';
import { Observable } from 'rxjs';

@Component({
    selector: 'my-component',
    template: ''
})
export class MyComponent {
    // Select state from the Store
    someState$: Observable<any> = this.store.select(state => state);

    constructor(
        private store: Store
    ) {
    }

    doSomething() {
        this.store.dispatch({type: 'some action'})
    }
}
 
```
### Redux Dev Tools
Small wrapper for the ReduxDevtoolsExtension from 'mini-rx-store'.
It is needed to trigger Angular Change Detection when using time travel in the Redux Dev Tools Browser PlugIn.

```ts
import { StoreDevtoolsModule } from 'mini-rx-store-ng';

@NgModule({
    imports: [
        // ...
        StoreDevtoolsModule.instrument({
            name: 'MiniRx Store',
            maxAge: 25,
            latency: 250,
        }),
    ]
})
export class AppModule {} 
```
