/*
 * Public API Surface of mini-rx-store
 */

export { actions$, default as Store } from './lib/store';
export { Feature as Feature } from './lib/feature';
export { createFeatureSelector, createSelector, } from './lib/selector';
export { Action } from './lib/interfaces';
export { ofType } from './lib/utils';
export { ReduxDevtoolsExtension, ReduxDevtoolsOptions } from './lib/redux-devtools.extension';
export { LoggerExtension} from './lib/logger.extension';
export { ImmutableStateExtension} from './lib/immutable-state.extension';
