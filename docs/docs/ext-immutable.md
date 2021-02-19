---
id: ext-immutable
title: Immutable State Extension
sidebar_label: Immutable State
---

Let's make sure that the state is not mutated accidentally.
State should only be changed by dispatching an action or by using `setState`.

The Immutable State Extension will throw an error if you mutate state.


## Register the extension

Configure the store with the `ImmutableStateExtension`:
```ts 
import { ImmutableStateExtension } from 'mini-rx-store';

const store: Store = configureStore({
    extensions: [
        new ImmutableStateExtension()
    ]
});
```
