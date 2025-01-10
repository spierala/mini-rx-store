---
id: angular
title: Angular Integration
sidebar_label: Angular Integration
---
[mini-rx-store-ng](https://www.npmjs.com/package/mini-rx-store-ng) is a package for better Angular Integration.

[![npm version](https://badge.fury.io/js/mini-rx-store-ng.svg)](https://www.npmjs.com/package/mini-rx-store-ng)

:::tip
For modern Angular (with [Signals](https://angular.dev/guide/signals) and standalone) we recommend to use the [MiniRx Signal Store](https://github.com/spierala/mini-rx-store/blob/master/libs/signal-store/README.md).
Signal Store comes with first-class support for Signals and standalone APIs.
:::

With [mini-rx-store-ng](https://www.npmjs.com/package/mini-rx-store-ng) we can use MiniRx Store the Angular way:

- [Configure the store](#configure-the-store-in-the-app-module) using `StoreModule.forRoot()`
- [Register feature reducers](#register-feature-reducers-in-angular-feature-modules) using `StoreModule.forFeature()`
- [Register effects](#register-effects) using `EffectsModule.register()` and `createEffect()`
- [Use Angular Dependency Injection](#get-hold-of-the-store-and-actions-via-the-angular-dependency-injection) for `Store` and `Actions`

## Usage

### Requirements
- Angular >= 17 

### Installation

`npm i mini-rx-store-ng`

### Configure the store in the app module
```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { StoreModule } from 'mini-rx-store-ng';

@NgModule({
  imports: [
    StoreModule.forRoot({
      extensions: [
        // Add extensions here
        // new LoggerExtension()
      ],
      reducers: {
        // Add feature reducers here
        // todo: todoReducer
      },
      metaReducers: [
        // Add meta reducers here
      ]
    }),
  ]
})
export class AppModule {}
```

### Register feature reducers in Angular feature modules

```ts title="todo.module.ts"
import { NgModule } from '@angular/core';
import { StoreModule } from 'mini-rx-store-ng';
import todoReducer from './todo-reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('todo', todoReducer),
  ]
})
export class TodoModule {}
```

### Register effects
Create an Angular service which holds all effects which belong to a specific feature module (e.g. "todo"):

```ts title="todo-effects.service.ts"
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType, mapResponse } from 'mini-rx-store';

import { ajax } from 'rxjs/ajax';
import { mergeMap } from 'rxjs/operators';

import { LoadTodosFail, LoadTodosSuccess, TodoActionTypes } from './todo-actions';
import { Todo } from './todo';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(
    this.actions$.pipe(
      ofType(TodoActionTypes.LoadTodos),
      mergeMap(() =>
        ajax<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
          tap(v => v),
          mapResponse(
            (res) => new LoadTodosSuccess(res.response),
            (err) => new LoadTodosFail(err)
          )
        )
      )
    )
  );

  constructor(private actions$: Actions) {}
}
```

Register the effects with `EffectsModule.register`:
```ts title="todo.module.ts"
import { NgModule } from '@angular/core';

import { EffectsModule, StoreModule } from 'mini-rx-store-ng';

import { TodoEffects } from './todo-effects.service';
import { todoReducer } from './todo-reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('todo', todoReducer),
    EffectsModule.register([TodoEffects]),
  ]
})
export class TodoModule {}
```
`EffectsModule.register` accepts an array of classes which contain effects.
It can be used in the root module and in feature modules.

:::warning
When using `EffectsModule.register`, you **must** write the effect with `createEffect`. Otherwise, the effect will be ignored.
:::

### Get hold of the store and actions via the Angular dependency injection
After we registered the StoreModule in the AppModule, we can use Angular DI to access `Store` and `Actions`.

For example in a component:

```ts
import { Component } from '@angular/core';
import { Store } from 'mini-rx-store';
import { Observable } from 'rxjs';

@Component({
  selector: 'my-component',
  template: ''
})
export class MyComponent {
  // Select state from the Store
  someState$: Observable<any> = this.store.select(state => state);

  constructor(private store: Store) {}

  doSomething() {
    this.store.dispatch({type: 'some action'})
  }
}
```
