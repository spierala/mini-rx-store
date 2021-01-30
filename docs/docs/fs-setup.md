---
id: fs-setup
title: Create a FeatureStore
sidebar_label: Setup
slud: /feature-store-setup
---

There are 2 Options to create a new FeatureStore.

### Option 1: Extend `FeatureStore`
```ts
import { FeatureStore } from 'mini-rx-store';

interface UserState {
    currentUser: User;
    favProductIds: string[];
}

const initialState: UserState = {
  currentUser: undefined,
  favProductIds: []
};

export class UserStateService extends FeatureStore<UserState>{
    constructor() {
        super('users', initialState);
    }
}
```
### Option2 : Functional creation method

We can create a FeatureStore with `createFeatureStore`

```ts
const fs: FeatureStore<TodoState> = createFeatureStore<TodoState>('user', initialState);
```
