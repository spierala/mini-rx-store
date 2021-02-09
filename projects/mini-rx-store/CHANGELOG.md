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
