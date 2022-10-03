---
id: effects
title: Effects
slug: /effects
---
Effects offer an advanced way to trigger side effects (e.g. API calls)

Using `effect` has the following benefits:
- you can more easily handle race conditions with RxJS flattening operators (e.g. switchMap, concatMap)
- the subscriptions are created internally (when registering an Effect)
- Effects help to isolate side effects from components 

### Writing Effects

Writing an effect consists of these basic parts:

- Listen for a specific action using (`ofType`)
- Handle race conditions with RxJS flattening operators (e.g. `mergeMap`)
- Perform the actual side effect
- Return a new action when the side effect completes
- Register the effect

Example:
```ts
import { actions$, ofType } from 'mini-rx-store';
import {
  LoadTodos,
  LoadTodosSuccess,
  LoadTodosFail,
  TodoActionTypes
} from './todo-actions';
import { Todo } from ".";
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';

const loadEffect = actions$.pipe(
  ofType(TodoActionTypes.LoadTodos),
  mergeMap(() =>
    ajax<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
      map(res => new LoadTodosSuccess(res.response)),
      catchError(err => of(new LoadTodosFail(err)))
    )
  )
);

// Register the effect
store.effect(loadEffect);

// Trigger the effect
store.dispatch(new LoadTodos())
```

The code above creates an effect. As soon as the `LoadTodos` action has been dispatched, the API call will be executed.
Depending on the result of the API call, a new action will be dispatched:
`LoadTodosSuccess` or `LoadTodosFail`.

The effect needs to be registered using `store.effect`.

:::warning
It is important to handle possible API errors with `catchError` to make sure that the effect source does not complete.
A completed effect source will stop listening to actions, and the effect does not work anymore.
:::warning

## mapResponse

It is important to handle possible errors (e.g. when the API call fails). 
The `mapResponse` operator enforces to handle the error case and reduces boilerplate.

`mapResponse` is a thin wrapper around RxJS `map` and `catchError`.

Example:

```ts
import { actions$, ofType, mapResponse } from 'mini-rx-store';
import {
    LoadTodosFail,
    LoadTodosSuccess,
    TodoActionTypes,
} from './todo-actions';
import { Todo } from '.';
import { mergeMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const loadEffect = actions$.pipe(
  ofType(TodoActionTypes.LoadTodos),
  mergeMap(() =>
    ajax<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
      mapResponse(
        res => new LoadTodosSuccess(res.response),
        err => new LoadTodosFail(err)
      )
    )
  )
);
```

## Configure the effect with `createEffect`

With `createEffect` you can pass additional configuration to an effect.

### Non-dispatching effects
In some situations your effect can not return a meaningful action. For example:

- when you only want to log 
- when you only want to navigate based on an incoming action

You can pass the `{dispatch: false}` config to the `createEffect` function to create an effect which does not dispatch an action.

Example:
```ts
const nonDispatchingEffect = createEffect(actions$.pipe(
  ofType(TodoActionTypes.LoadTodos),
  tap((v) => console.log('LoadTodos', v))
), {dispatch: false});

// Register the effect
store.effect(nonDispatchingEffect);
```
