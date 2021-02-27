---
id: fs-setup
title: Create a FeatureStore
sidebar_label: Setup
slud: /feature-store-setup
---

There are 2 Options to create a new Feature Store.

### Option 1: Extend `FeatureStore`
```ts title="todo-feature-store.ts"
import { FeatureStore } from 'mini-rx-store';
import { Todo } from './todo';

export interface TodoState {
  todos: Todo[];
  selectedTodoId: number
}

export const initialState: TodoState = {
  todos: [],
  selectedTodoId: undefined
};

export class TodoFeatureStore extends FeatureStore<TodoState> {
  constructor() {
    super('todo', initialState)
  }
}
```

Extending the `FeatureStore` requires to pass the feature key (e.g. 'todo') and the initial state.
We have to provide a TypeScript interface to `FeatureStore` to get type safety: `FeatureStore<TodoState>`.

### Option2 : Functional creation method

We can create a Feature Store with `createFeatureStore`

```ts
const todoFs: FeatureStore<TodoState> = createFeatureStore<TodoState>('todo', initialState);
```

The following examples will be based on Option 1 (Extend).
