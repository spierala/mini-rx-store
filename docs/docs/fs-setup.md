---
id: fs-setup
title: Create a FeatureStore
sidebar_label: Setup
slud: /feature-store-setup
---

There are 2 Options to create a new FeatureStore.

### Option 1: Extend `FeatureStore`
```ts title="todo-feature-store.ts"
import { FeatureStore } from "mini-rx-store";
import { Todo } from "./todo";

export interface TodoState {
    todos: Todo[];
    selectedTodoId: string
}

export const initialState: TodoState = {
    todos: [],
    selectedTodoId: undefined
};

class TodoFeatureStore extends FeatureStore<TodoState> {
    constructor() {
        super('todo', initialState)
    }
}
```
### Option2 : Functional creation method

We can create a FeatureStore with `createFeatureStore`

```ts
const todoFs: FeatureStore<TodoState> = createFeatureStore<TodoState>('todo', initialState);
```

The following examples will be based on Option 1 (Extend).
