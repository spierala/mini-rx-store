---
id: intro
title: Quick Start
sidebar_label: Quick Start
slug: /intro
---

## Purpose
**MiniRx Store** provides Reactive State Management for Javascript Applications inspired by [Redux](https://redux.js.org/).
The Store is powered by [RxJS](https://rxjs.dev/). It uses RxJS Observables to notify subscribers about state changes.

## MiniRx Store Features

-   Minimal configuration and setup
-   Framework agnostic: MiniRx works with any front-end project built with JavaScript or TypeScript (Angular, React, Vue, or anything else)
-   TypeScript support (MiniRx is written in TypeScript itself)
-   [Store (Redux API)](redux):
    -   Actions
    -   Reducers
    -   Meta Reducers
    -   Memoized Selectors
    -   Effects
    -   [Support for ts-action](ts-action): Create and consume actions with as little boilerplate as possible
-   [FeatureStore](fs-quick-start): Update state without actions and reducers:
    -   `setState()` update the feature state
    -   `select()` read feature state
    -   `effect()` run side effects like API calls and update feature state
    -   `undo()` easily undo setState actions
-   [Extensions](ext-quick-start):
    - Redux Dev Tools Extension: Inspect State with the Redux Dev Tools
    - Immutable Extension: Enforce immutability
    - Undo Extension: Undo dispatched Actions
    - Logger Extension: console.log the current action and updated state
-   [Angular Integration](angular): Use MiniRx Store the Angular way: `StoreModule.forRoot()`, `StoreModule.forFeature()`, ...

## Demos
- [Todos App using FeatureStore](https://stackblitz.com/edit/mini-rx-angular-todos?file=src%2Fapp%2Fmodules%2Ftodo%2Fservices%2Ftodos-state.service.ts)
- Coming soon: Redux Demo
