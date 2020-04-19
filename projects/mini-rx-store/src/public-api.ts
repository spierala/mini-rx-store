/*
 * Public API Surface of mini-rx-store
 */

export { actions$, default as Store } from './lib/store';
export { Feature as Feature } from './lib/feature';
export { createFeatureSelector, createSelector, } from './lib/selector';
export { Action, Settings } from './lib/interfaces';
export { ofType } from './lib/utils';
export { ReduxDevtoolsExtension, ReduxDevtoolsOptions } from './lib/redux-devtools/redux-devtools.extension';
