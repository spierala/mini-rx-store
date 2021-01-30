---
id: fs-set-state
title: Update State
sidebar_label: Set State
slug: /update-feature-state
---

`setState` accepts a Partial Type. This allows us to pass only some properties of a bigger state interface.
```ts
updateUser(user: User) {
    this.setState({currentUser: user});
}
```
Do you need to update the new state based on the current state?
`setState` accepts a callback function which gives you access to the current state.
```ts
// Update state based on current state
addFavorite(productId) {
    this.setState(state => ({
        favProductIds: [...state.favProductIds, productId]
    }));
}
```
For better logging in the JS Console / Redux Dev Tools you can provide an optional name to the `setState` function:

```ts
this.setState({currentUser: user}, 'updateUser');
```
