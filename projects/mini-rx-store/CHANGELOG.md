# 1.0.0-rc.1 (2020-06-09)

### BREAKING CHANGES

* `Store.feature`: initialState parameter is now optional and the last parameter. Reducers initial state is most commonly set in the reducer function itself as default parameter value (see Reducer example in the README).
New usage: `Store.feature<ProductState>('products', reducer);`

# 1.0.0-rc.2 (2020-06-23)

### BREAKING CHANGES
* `Feature.setState`, `Feature.createEffect`: remove support for setStateCallback

### Features
* Effects (Store, Feature): Prevent Effect to unsubscribe from the actions stream (if side effect error is not catched)
* Feature API: expose state snapshot via `this.state`

### Bug Fixes
* Fix typing issue with `Feature.select

# 1.0.0 (2020-08-03)
### Bug Fixes
* Feature API: setState default action payload: only partial state

# 1.0.1 (2020-09-06)
### Bug Fixes
* Feature API: fix issue: select returns AnonymousSubject instead of Observable
