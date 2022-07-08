# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [4.0.0-alpha.13](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.12...mini-rx-store-4.0.0-alpha.13) (2022-07-08)

## [4.0.0-alpha.12](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.11...mini-rx-store-4.0.0-alpha.12) (2022-06-29)

## [4.0.0-alpha.11](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.10...mini-rx-store-4.0.0-alpha.11) (2022-06-14)


### Bug Fixes

* **mini-rx-store:** mapResponse: import mergeMap from rxjs/operators ([7d2ab3d](https://github.com/spierala/mini-rx-store/commit/7d2ab3dd6b6d5674f4fffd3e7d1c6ec30ae43b54))

## [4.0.0-alpha.10](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.9...mini-rx-store-4.0.0-alpha.10) (2022-06-14)


### Features

* **mini-rx-store:** mapResponse ([93a6dc9](https://github.com/spierala/mini-rx-store/commit/93a6dc97f99e8c01e14ee985b18184738c67f0dc))

### Bug Fixes

* **mini-rx-store:** log setState callback result in devtools and logger extension ([dafbf6c](https://github.com/spierala/mini-rx-store/commit/dafbf6cb8bf3335e86a294435b696f9a510158f6))

## [4.0.0-alpha.9](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.8...mini-rx-store-4.0.0-alpha.9) (2022-06-08)


### Features

* **mini-rx-store:** createFeatureStore with config.multi ([5bdb2b4](https://github.com/spierala/mini-rx-store/commit/5bdb2b465a0ffd5c6b102d47e543891b2dde7b38))
* **mini-rx-store:** FeatureStore config.multi: Allow to have multiple instances of the same Store ([b5893c8](https://github.com/spierala/mini-rx-store/commit/b5893c8833c368e0b9c561883c02b712fc0c3d1b))

## [4.0.0-alpha.8](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.7...mini-rx-store-4.0.0-alpha.8) (2022-06-01)

## [4.0.0-alpha.7](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.6...mini-rx-store-4.0.0-alpha.7) (2022-05-20)


### ⚠ BREAKING CHANGES

* **mini-rx-store:** tapResponse object callback name suffixes are removed: e.g. nextFn -> next

### Bug Fixes

* **mini-rx-store:** FeatureStore.effect with Observable argument: Observable completion should not stop the effect ([9a5c222](https://github.com/spierala/mini-rx-store/commit/9a5c2229620c7073edc35f58f08e9260fabd77ba))

### Code Refactoring

* **mini-rx-store:** align tapResponse object parameter type with RxJS TapObserver ([5aed940](https://github.com/spierala/mini-rx-store/commit/5aed9404f8498f9c1934f4348c971dea0095c9cf))

## [4.0.0-alpha.6](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.5...mini-rx-store-4.0.0-alpha.6) (2022-05-12)


### Features

* **mini-rx-store:** FeatureStore.effect: parameter for the returned function can be an Observable ([3440606](https://github.com/spierala/mini-rx-store/commit/3440606771ec89a50363df781d3b0eb4558e3416))

## [4.0.0-alpha.5](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.4...mini-rx-store-4.0.0-alpha.5) (2022-05-10)


### Bug Fixes

* **mini-rx-store:** tapResponse: use finalize from 'rxjs/operators' ([b705e67](https://github.com/spierala/mini-rx-store/commit/b705e67f3e1f3dec693a6abe687f81a660610da0))

## [4.0.0-alpha.4](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.3...mini-rx-store-4.0.0-alpha.4) (2022-05-10)


### Features

* **mini-rx-store:** tapResponse operator for error handling in effects: finalize callback ([6579396](https://github.com/spierala/mini-rx-store/commit/6579396113dd89c343516ad2030e828e4470d4d4))

## [4.0.0-alpha.3](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.2...mini-rx-store-4.0.0-alpha.3) (2022-05-07)


### Features

* **mini-rx-store:** tapResponse operator for error handling in effects ([488f5eb](https://github.com/spierala/mini-rx-store/commit/488f5eb7ca41d8309b70aa03ea7fd35543fbb010))

## [4.0.0-alpha.2](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.1...mini-rx-store-4.0.0-alpha.2) (2022-05-04)

## [4.0.0-alpha.1](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-4.0.0-alpha.0...mini-rx-store-4.0.0-alpha.1) (2022-05-02)


### ⚠ BREAKING CHANGES

* **mini-rx-store:** effect requires now a generic type

### Bug Fixes

* **mini-rx-store:** better FeatureStore effect typings ([5fe61f1](https://github.com/spierala/mini-rx-store/commit/5fe61f1269463f790f1e12a50d0b2a6c585ededc))

# 4.0.0-alpha.0
### BREAKING CHANGES
* Refactor to NX workspace 

# 3.1.0 (2022-01-28)
### Bugfixes
Undo Extension: unexpected feature state when reducer is added and removed under the same feature key

### Refactor
* Store, Feature Store: Refactored action names: @mini-rx/set-state/products/load success instead of @mini-rx/products/set-state/load success, @mini-rx/init-feature/products instead of @mini-rx/products/init
* Feature Store: Feature reducer setState check more performant
* Feature Store: more lightweight unsubscribe with Subscription.add
* Feature Store: setState action payload can be a function or an object (necessary to fix Undo Extension issue)
* General minor changes for less bundle size

# 3.0.1 (2021-11-25)
### Bugfixes
Feature Store: improve state type: prevent using number, string etc as state type

# 3.0.0 (2021-09-07)
Change RxJS peer dependency, fix dependency versions of deep-freeze-strict and memoize-one

# 3.0.0-rc.2 (2021-07-06)
### Bugfixes
* Undo Extension: Add feature init action to buffered actions

### Refactor
* Feature Store: featureKey parameter in constructor: _featureKey -> featureKey

# 3.0.0-rc.1 (2021-06-15)
Downgrade ng-packagr

# 3.0.0-rc.0 (2021-06-14)

### Features
* FeatureStore: expose FeatureStore.state$

### Refactor
* Store: shorten error message: "`configureStore` detected reducers".

# 3.0.0-beta.3 (2021-05-31)

### Features
Typings: configureStore initialState type has to match the provided reducers map keys.

### Refactor
* Store: improve miniRx error message
* FeatureStore: rename: featureName -> featureKey

# 3.0.0-beta.2 (2021-05-17)

### BREAKING CHANGES
* Throw error when instantiating FeatureStores before calling configureStore

### DEPRECATIONS
* FeatureStore.state$: use FeatureStore.select() instead
* Store.createEffect: use Store.effect

### Refactor
* Store.getInstance -> Store.configureStore

# 3.0.0-beta.0 (2021-05-10)

### BREAKING CHANGES
* Store config initial state must match the reducer keys (initial state properties which have no corresponding reducer key will be dropped)

### Features
* Feature Store: destroyable
* Feature Store effect: resubscribe the effect 10 times (if side effect error is not handled)

### Bugfixes
* Undo Extension: exclude more miniRx Actions from buffered actions
* default-effects-error-handler: console.error instead of silencing the error 

### Refactor
* Store Core: remove obsolete ActionWithMeta
* Store Core: use action subscribe to update state, remove tap operator

# 2.0.1 (2021-05-08)

### Bugfixes
* default-effects-error-handler: console.error instead of silencing the error

# 2.0.0-beta.4 (2021-03-15)

### Bugfixes
* LoggerExtension: log action instead of action.payload

### Refactor
* FeatureStore state$: expose state as Observable

# 2.0.0-beta.3 (2021-02-19)

### BREAKING CHANGES
* Action class: removed payload property

### DEPRECATIONS
* FeatureStore.state$: use FeatureStore.select instead

### Refactor
* Cleanup FeatureStore.select: createSelector mapFn should not be a memoized selector
* Extensions: use sortOrder prop for metaReducers execution order

### Features
* Cleanup README and create docs (docusaurus)

# 2.0.0-beta.2 (2021-01-22)
### Bug Fixes
* FeatureStores not working if StoreCore.config is not called (in case only FeatureStores are created without using StoreModule or configureStore)

# 2.0.0-beta.0 (2021-01-22)

### BREAKING CHANGES
* Store instance: `Store` does not hold the Store instance anymore: use `const store: Store = configureStore({})`
* Removed `Store.settings`: No settings anymore for logging, use LoggerExtension instead
* Renamed Feature -> FeatureStore
* `Feature.createEffect`: do not return new state anymore, instead call setState to update state
* Renamed `Feature.createEffect` to `Feature.effect`
* `Feature.select`: Removed selectFromStore parameter, use store.select instead
* `Store.feature`: Removed initial state parameter, use config parameter instead
* Removed `Store.addExtension`: use `configureStore` instead


### DEPRECATIONS
* Store: `createEffect`: Use `effect` instead

### Features
* MetaReducers: Root MetaReducers, Feature MetaReducers
* Configure Store (`configureStore`): Root Reducers, initial state, Meta Reducers, Extensions
* `store.feature` configuration: initial state, Meta Reducers
* LoggerExtension
* ImmutableExtension
* UndoExtension
* `FeatureStore.undo`: undo setState Actions (requires Undo Extension)
* `FeatureStore.setState`: supports callback function
* `FeatureStore.setState`: returns an Action
* FeatureStore: Dispatch setState Actions only to the reducer of the FeatureStore (for performance)
* Functional creation method for FeatureStore: `createFeatureStore`
* Support for optional Angular PlugIn: mini-rx-store-ng: Angular friendly API: `StoreModule.forRoot()`, `StoreModule.forFeature()`, DI support for `Store`, `Actions`

# 1.0.1 (2020-09-06)
### Bug Fixes
* Feature API: fix issue: select returns AnonymousSubject instead of Observable


# 1.0.0 (2020-08-03)
### Bug Fixes
* Feature API: setState default action payload: only partial state

# 1.0.0-rc.2 (2020-06-23)

### BREAKING CHANGES
* `Feature.setState`, `Feature.createEffect`: remove support for setStateCallback

### Features
* Effects (Store, Feature): Prevent Effect to unsubscribe from the actions stream (if side effect error is not catched)
* Feature API: expose state snapshot via `this.state`

### Bug Fixes
* Fix typing issue with `Feature.select`

# 1.0.0-rc.1 (2020-06-09)

### BREAKING CHANGES

* `Store.feature`: initialState parameter is now optional and the last parameter. Reducers initial state is most commonly set in the reducer function itself as default parameter value (see Reducer example in the README).
New usage: `Store.feature<ProductState>('products', reducer);`
