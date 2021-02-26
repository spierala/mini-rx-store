---
id: fs-effect 
title: Effects 
sidebar_label: Effects 
slug: /effects-for-feature-store
---
`effect` offers a simple way to trigger side effects (e.g. API calls) for a Feature Store. 
When the side effect completed we can update feature state straight away (by using `setState()`).

Example:

```ts title="todo-feature-store.ts"
import { EMPTY } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

loadTodos = this.effect(payload$ => {
    return payload$.pipe(
        mergeMap(() =>
            ajax('https://jsonplaceholder.typicode.com/todos').pipe(
                tap(res => this.setState({todos: res.response})),
                catchError(err => EMPTY)
            )
        )
    );
});

// Effect using the payload value
loadTodoById = this.effect<number>(payload$ => {
    return payload$.pipe(
        mergeMap((id) =>
            ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(
                tap(res => this.setState({todos: res.response})),
                catchError(err => EMPTY)
            )
        )
    );
});

// Start the effects
this.loadTodos();
this.loadTodoById(5);
```
The code above creates an effect for _fetching the todos_.
The API call is the side effect which needs to be performed.
`effect` returns a function which can be called later to start the effect with an optional payload (see `this.loadTodoById(5)`).

Inside the `payload$.pipe` we can define how to handle the side effect.
With RxJS flattening operators (mergeMap, switchMap, concatMap, exhaustMap) we can easily take care of race conditions (e.g. if you trigger a lot of API calls at the same time).

Inside the RxJS `tap` and `catchError` operators we can call `this.setState()` to update state.

:::warning
It is important to handle possible API errors with `catchError` to make sure that the `payload$` stream does not die.
:::warning

:::info
We can skip the `payload$.pipe` if we use only one RxJS operator:
```ts
loadTodoById = this.effect<number>(
    mergeMap((id) =>
        ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(
            tap(res => this.setState({todos: res.response})),
            catchError(err => EMPTY)
        )
    )
);
```
:::info
