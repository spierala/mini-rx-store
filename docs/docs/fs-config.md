---
id: fs-config
title: Local Component State
sidebar_label: Local Component State
slug: /local-component-state
---

With MiniRx Feature Stores you can also manage **local component state**.

### What is local component state?
- State which is bound to a component
- State which has the lifespan of a component
- State which can exist multiple times (if the corresponding component exists multiple times)

:::info
If you want to go for fully local state management, take a look at MiniRx [Component Store](component-store).
Component Store state does not become part of the global state object.
:::info


### Multiple Feature Store instances
By default, a Feature Store with a certain feature key can only be created **once**.
But in order to manage local component state, you might need to create **multiple** instances of the same Feature Store.

You can use the `{multi: true}` configuration to allow multiple instances.

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
The Redux DevTools indicate that MiniRx created four "counter" Feature Stores with unique feature keys.

![Redux DevTools for MiniRx](/img/local-component-state-mini-rx.png)

## Destroy
When the component is destroyed, then you most likely want to destroy the corresponding Feature Store as well. 

For that reason, `FeatureStore` exposes the `destroy` method. 

The `destroy` method does two things:

- clean up all internal Observable subscriptions (e.g. from effects)
- remove the corresponding feature state from the global state object

### Destroy in Svelte

Example: Call `destroy` manually in Svelte

```ts 
import { Observable } from 'rxjs';
import { FeatureStore } from 'mini-rx-store';
import { onDestroy } from 'svelte';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 42,
};

export class CounterStore extends FeatureStore<CounterState> {
  constructor() {
    super('counter', initialState, {multi: true});
    
    onDestroy(() => {
        this.destroy();
    });
  }
}
```
See the source from the [MiniRx Svelte Demo](https://github.com/spierala/mini-rx-svelte-demo/blob/master/frontend/src/modules/counter/components/state/counter-store.ts).

### Automatic destroy in Angular
In Angular, you can provide a Feature Store on component level in the `@Component` decorator like this: 

```ts

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterStore } from '../state/counter-store.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  providers: [CounterStore], // The CounterStore is provided for each counter component instance
})
export class CounterComponent {
  constructor(private counterStore: CounterStore) {}
}
```
Now, the lifespan of the CounterStore is bound to the component lifespan. 
Angular will instantiate a CounterStore when a CounterComponent is created.
Angular will also call the Feature Store `destroy` method for us when the component is destroyed.

The CounterStore itself is just an Angular Injectable (without the `providedIn` config):

```ts
@Injectable()
export class CounterStore extends FeatureStore<CounterState> {
  constructor() {
    super('counter', initialState, { multi: true });
  }
}
```

See the source from the [MiniRx Angular Demo](https://github.com/spierala/mini-rx-store/blob/master/apps/mini-rx-angular-demo/src/app/modules/counter/state/counter-store.service.ts).

### Destroy in other frameworks
In other frameworks (or without a framework) you have to call the `destroy` method manually, when the corresponding component is destroyed.
