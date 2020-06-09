# 1.0.0-rc.1 (2020-06-09)

### BREAKING CHANGES

* `Store.feature`: initialState parameter is now optional and the last parameter. Reducers initial state is most commonly set in the reducer function itself as default parameter value (see Reducer example in the README).

New usage: `Store.feature<ProductState>('products', reducer);`