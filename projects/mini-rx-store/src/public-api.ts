/*
 * Public API Surface of mini-rx-store
 */

export { actions$, store, Store } from './lib/store';
export { Feature } from './lib/feature';
export { createFeatureSelector, createSelector } from './lib/selector';
export { Action, Reducer } from './lib/interfaces';
export { ofType } from './lib/utils';
export { ReduxDevtoolsExtension, ReduxDevtoolsOptions } from './lib/redux-devtools.extension';
export { LoggerExtension, loggerMetaReducer } from './lib/logger.extension';
export { ImmutableStateExtension } from './lib/immutable-state.extension';
export { StoreModule } from './lib/store.module';
