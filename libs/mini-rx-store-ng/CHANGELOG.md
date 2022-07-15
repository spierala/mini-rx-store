# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

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
