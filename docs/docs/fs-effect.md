---
id: fs-effect 
title: Effects 
sidebar_label: Effects 
slug: /effects-for-feature-store
---
`effect` offers an advanced way to trigger side effects (e.g. API calls) for a Feature Store. 
When the side effect completed we can update feature state straight away (by using `setState()`).

Using `effect` has the following benefits: 
- you can more easily handle race conditions with RxJS flattening operators (e.g. switchMap, concatMap)
- the subscriptions are created internally and cleaned up as soon as the Feature Store is destroyed

Example:

```ts title="todo-feature-store.ts"
import { EMPTY, pipe } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

loadTodos = this.effect<void>(
  pipe(
    mergeMap(() =>
      ajax('https://jsonplaceholder.typicode.com/todos').pipe(
        tap((res) => this.setState({ todos: res.response })),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      )
    )
  )
);

// Effect using the payload value
loadTodoById = this.effect<number>(
  pipe(
    mergeMap((id) =>
      ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(
        tap((res) => this.setState({ todos: res.response })),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      )
    )
  )
);

// Start the effects
this.loadTodos();
this.loadTodoById(5);
```
The code above creates two effects for fetching todos from an API.
`effect` returns a function which can be called later to start the effect with an optional payload (see `this.loadTodoById(5)`).

Inside the RxJS standalone `pipe` we can define how to handle the side effect.
With RxJS flattening operators (mergeMap, switchMap, concatMap, exhaustMap) we can take care of race conditions (e.g. if you trigger a lot of API calls at the same time).

Inside the RxJS `tap` and `catchError` operators we can call `this.setState()` to update state.

:::warning
It is important to handle possible API errors with `catchError` to make sure that the effect source does not complete. Otherwise, the effect will not work anymore. 

The `tapResponse` operator will help you to enforce error handling with less boilerplate. [Read more about tapResponse...](fs-effect.md#tapresponse)
:::warning

:::info
We can skip the RxJS standalone `pipe` if we use only one RxJS operator:
```ts
loadTodoById = this.effect<number>(
  mergeMap((id) =>
    ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(
      tap((res) => this.setState({ todos: res.response })),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    )
  )
);
```
:::info

## tapResponse

When using `effect` it is important to handle possible errors (e.g. when the API call fails).
The `tapResponse` operator enforces to handle the error case and reduces boilerplate. 

`tapResponse` is a thin wrapper around RxJS `tap` and `catchError`.

Example:

```ts title="todo-feature-store.ts"
import { tapResponse } from 'mini-rx-store';

loadTodos = this.effect<void>(
  pipe(
    mergeMap(() =>
      ajax('https://jsonplaceholder.typicode.com/todos').pipe(
        tapResponse(
          (res) => this.setState({ todos: res.response }),
          (err) => console.error(err)
        )
      )
    )
  )
);
```
:::info
`tapResponse` accepts an optional third parameter for handling the `finalize` case. 
For example, it can be used to set a loading state to `false` if the API call succeeds **or** fails.
:::info
