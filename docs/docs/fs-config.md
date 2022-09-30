---
id: fs-config
title: Local Component State
sidebar_label: Local Component State
slug: /local-component-state
---

With MiniRx Feature Stores you can also manage **local component state**...

By default, a Feature Store with a certain feature key can only be created **once**.
But in some situations you might want to create **multiple** instances of the same Feature Store: 
E.g. if you have to manage state, which is bound to a component and if that component can exist multiple times.

You can use the `{multi: true}` configuration to allow multiple instances of a Feature Store.

Example:

```ts
import { Observable } from 'rxjs';
import { FeatureStore } from 'mini-rx-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

export class CounterStore extends FeatureStore<CounterState> {
    count$: Observable<number> = this.select((state) => state.count);

    constructor() {
        super('counter', initialState, { multi: true });
    }

    increment() {
        this.setState({ count: this.state.count + 1 }, 'increment');
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'decrement');
    }
}
```
The code above defines a CounterStore with the `{multi: true}` configuration.
Now you can create many instances of the CounterStore.

In the following screenshot from the [Angular Demo](https://angular-demo.mini-rx.io/#/counter) you can see many Counter components.
The Redux DevTools indicate that MiniRx created four Feature Stores with unique feature keys.

![Redux Dev Tools for MiniRx](/img/local-component-state-mini-rx.png)
