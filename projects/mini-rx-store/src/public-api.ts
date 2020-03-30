/*
 * Public API Surface of mini-rx-store
 */

export { Action, Settings } from './lib/interfaces';
export { actions$, default as Store } from './lib/mini-store';
export { MiniFeature as Feature } from './lib/mini-feature';
export { createFeatureSelector, createSelector, ofType } from './lib/mini-store.utils';
export { ReduxDevtoolsExtension } from './lib/redux-devtools/redux-devtools.extension';
