# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [4.0.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-4.0.0-rc.0...mini-rx-store-ng-4.0.0) (2023-04-17)

## [4.0.0-rc.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-4.0.0-alpha.3...mini-rx-store-ng-4.0.0-rc.0) (2023-04-13)

## [4.0.0-alpha.3](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-4.0.0-alpha.2...mini-rx-store-ng-4.0.0-alpha.3) (2023-02-03)


### ⚠ BREAKING CHANGES

* **mini-rx-store-ng:** Use the normal `ReduxDevtoolsExtension` from mini-rx-store with `StoreModule.forRoot`

### Code Refactoring

* **mini-rx-store-ng:** remove StoreDevtoolsModule ([2635ef6](https://github.com/spierala/mini-rx-store/commit/2635ef6312dbff9333938c4e6d4e540cbe10de42))

## [4.0.0-alpha.2](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-4.0.0-alpha.1...mini-rx-store-ng-4.0.0-alpha.2) (2023-02-03)


### Bug Fixes

* **mini-rx-store-ng:** in StoreModule: prevent exception if extensions prop is not defined ([429cda6](https://github.com/spierala/mini-rx-store/commit/429cda6e768aafcfabc0760ddcbf789c5819da85))

## [4.0.0-alpha.1](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-4.0.0-alpha.0...mini-rx-store-ng-4.0.0-alpha.1) (2023-02-01)


### Features

* **mini-rx-store-ng:** use ReduxDevtoolsExtension with the normal StoreModule.forRoot config ([1e7dd80](https://github.com/spierala/mini-rx-store/commit/1e7dd803b44cd85d2866765019534daed35c39a3))

## [4.0.0-alpha.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0...mini-rx-store-ng-4.0.0-alpha.0) (2023-01-23)


### ⚠ BREAKING CHANGES

* **mini-rx-store-ng:** requires mini-rx-store@5

### Features

* **mini-rx-store-ng:** component store module ([61193d5](https://github.com/spierala/mini-rx-store/commit/61193d59f9661861ab6a0fba30cb8146dd1127d7))

## [3.0.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-rc.0...mini-rx-store-ng-3.0.0) (2022-10-12)

## [3.0.0-rc.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-beta.1...mini-rx-store-ng-3.0.0-rc.0) (2022-09-19)

## [3.0.0-beta.1](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-beta.0...mini-rx-store-ng-3.0.0-beta.1) (2022-09-04)

### ⚠ BREAKING CHANGES

* **mini-rx-store-ng:** `createEffect` **must** be used for creating effects which are registered via the EffectsModule. The change was necessary to prevent registering other Observables which are not an Effect and which do not emit an Action.

## [3.0.0-beta.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.4...mini-rx-store-ng-3.0.0-beta.0) (2022-07-15)

## [3.0.0-beta.0](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.4...mini-rx-store-ng-3.0.0-beta.0) (2022-07-15)

## [3.0.0-alpha.4](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.3...mini-rx-store-ng-3.0.0-alpha.4) (2022-07-13)


### ⚠ BREAKING CHANGES

* **mini-rx-store-ng:** use FeatureConfig instead of FeatureStoreConfig

### Code Refactoring

* **mini-rx-store-ng:** rename FeatureStoreConfig -> FeatureConfig ([6fc052d](https://github.com/spierala/mini-rx-store/commit/6fc052d5914a1e62d055165d7380b8a2db1fb3ae))

## [3.0.0-alpha.3](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.2...mini-rx-store-ng-3.0.0-alpha.3) (2022-05-03)

## [3.0.0-alpha.2](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.1...mini-rx-store-ng-3.0.0-alpha.2) (2022-05-03)

## [3.0.0-alpha.1](https://github.com/spierala/mini-rx-store/compare/mini-rx-store-ng-3.0.0-alpha.0...mini-rx-store-ng-3.0.0-alpha.1) (2022-05-02)

Update peer deps (Remove angular/common, lower angular/core to v12)

# 3.0.0-alpha.0
### BREAKING CHANGES
* Refactor to NX workspace
* Requires Angular@12

# 2.0.0 (2021-09-07)
Update peer deps

# 2.0.0-rc.2 (2021-07-05)
Update peer deps

# 2.0.0-rc.1 (2021-06-15)
Downgrade ng-packagr

# 2.0.0-rc.0 (2021-06-14)
This release contains the same set the of changes as 2.0.0-beta.1.

# 2.0.0-beta.1 (2021-05-31)

### Features
Typings: Store.forRoot initialState type has to match the provided reducers map keys.

# 2.0.0-beta.0 (2021-05-17)

### BREAKING CHANGES

* Store config initial state must match the reducer keys

# 1.0.0-beta.1 (2021-03-15)

### Features
* StoreModule.forFeature: support multiple forFeature registrations per angular module
