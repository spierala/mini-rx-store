/*
 * Public API Surface of mini-rx-store
 */

export { Action, Settings } from './lib/interfaces';
export { actions$ } from './lib/mini-store-core';
export { MiniStore } from './lib/mini-store';
export { MiniFeature } from './lib/mini-feature';
export { createFeatureSelector, createSelector, ofType } from './lib/mini-store.utils';
export { ReduxDevtoolsExtension } from './lib/redux-devtools/redux-devtools.extension';

