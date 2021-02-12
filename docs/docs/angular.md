---
id: angular
title: Angular Integration
sidebar_label: Angular Integration
---
[mini-rx-store-ng](https://www.npmjs.com/package/mini-rx-store-ng) is a package for better Angular Integration.

[![npm version](https://badge.fury.io/js/mini-rx-store-ng.svg)](https://www.npmjs.com/package/mini-rx-store-ng)

With [mini-rx-store-ng](https://www.npmjs.com/package/mini-rx-store-ng) we can use MiniRx Store the Angular way:

- [Configure the store](#configure-the-store-in-the-app-module) using `StoreModule.forRoot()`
- [Register Feature States](#register-feature-states-in-angular-feature-modules) using `StoreModule.forFeature()`
- [Register Effects](#register-effects) using `EffectsModule.register()`
- [Use Angular Dependency Injection](#get-hold-of-the-store-and-actions-via-the-angular-dependency-injection) for `Store` and `Actions`
- [Redux Devtools Extension](#redux-dev-tools)

## Usage

### Installation:

`npm i mini-rx-store-ng`

### Configure the Store in the App Module
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
                // Add root reducers here
                // todo: todoReducer
            },
            metaReducers: [
                // Add root meta reducers
            ]
        }),
    ]
})
export class AppModule {}
```

### Register Feature States in Angular Feature Modules

```ts title="todo.module.ts"
import { NgModule } from '@angular/core';
import { StoreModule } from 'mini-rx-store-ng';
import todoReducer from './todo-reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('todo', todoReducer),
    ]
})
export class TodoModule {
    constructor() {}
}
```

### Register Effects
Create an Angular service which holds all effects which belong to a Feature (e.g. "todo").

```ts title="todo-effects.service.ts"
import { Injectable } from '@angular/core';

import { Actions, ofType } from 'mini-rx-store';

import { ajax } from 'rxjs/ajax';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { LoadTodosFail, LoadTodosSuccess, TodoActionTypes } from './todo-actions';

@Injectable({providedIn: 'root'})
export class TodoEffects {
    loadTodos$ = this.actions$.pipe(
        ofType(TodoActionTypes.LoadTodos),
        mergeMap(() =>
            ajax('https://jsonplaceholder.typicode.com/todos').pipe(
                map(res => new LoadTodosSuccess(res.response)),
                catchError(err => of(new LoadTodosFail(err)))
            )
        )
    );

    constructor(
        private actions$: Actions
    ) {
    }
}
  
```

Register the Effects
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
export class TodoModule {
}
```
The `register` method from the EffectsModule accepts an array of classes with effects and can be used in both, root and feature modules.

### Get hold of the store and actions via the Angular Dependency Injection
After we registered the StoreModule in the AppModule we can use Angular DI to access `Store` and `Actions`.

For example in a component:

```ts
import { Component } from '@angular/core';
import { Store } from 'mini-rx-store';
import { Observable } from 'rxjs';
import { Actions } from './models';

@Component({
    selector: 'my-component',
    template: ''
})
export class MyComponent {
    // Select state from the Store
    someState$: Observable<any> = this.store.select(state => state);

    constructor(
        private store: Store,
    ) {
        
    }

    doSomething() {
        this.store.dispatch({type: 'some action'})
    }
}
```
