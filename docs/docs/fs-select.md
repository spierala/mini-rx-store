---
id: fs-select
title: Select State
sidebar_label: Select
slug: select-feature-state
---

## Reactive Select
```ts
import { Observable } from 'rxjs';

public currentUser$: Observable<User> = this.select(state => state.currentUser);
```

`select` takes a callback function which gives you access to the current feature state (see the `state` parameter).
Within that function you can pick a specific piece of state.
`select` returns an Observable which will emit as soon as the selected state changes.

## Memoized Selectors

You can use memoized selectors also with the FeatureStore... 
You only have to omit the feature name when using `createFeatureSelector`.
This is because the `FeatureStore` is operating on a specific feature state already 
(the corresponding feature name has been provided in the constructor).

```ts
import { createFeatureSelector, createSelector } from 'mini-rx-store';

const getUserFeatureState = createFeatureSelector<UserState>(); // Omit the feature name!

const getCurrentUser = createSelector(
    getUserFeatureState,
    state => state.currentUser
);


// Inside the User state service
export class UserStateService extends FeatureStore<UserState>{
    currentUser$ = this.select(getCurrentUser);

    constructor() {
        super('products', initialState); // Feature name 'products' is provided here already...
    }
}
```
