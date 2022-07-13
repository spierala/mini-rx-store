/*
 * Public API Surface of mini-rx-store
 */

export { actions$, Store, configureStore } from './lib/store';
export { default as _StoreCore } from './lib/store-core';
export { FeatureStore, createFeatureStore } from './lib/feature-store';
export { createFeatureSelector, createSelector } from './lib/selector';
export {
    Action,
    Reducer,
    Actions,
    ReducerDictionary,
    StoreConfig,
    FeatureConfig,
    StoreExtension,
} from './lib/models';
export { ofType } from './lib/utils';
export {
    ReduxDevtoolsExtension,
    ReduxDevtoolsOptions,
} from './lib/extensions/redux-devtools.extension';
export { LoggerExtension } from './lib/extensions/logger.extension';
export { ImmutableStateExtension } from './lib/extensions/immutable-state.extension';
export { UndoExtension, undo } from './lib/extensions/undo.extension';
export { tapResponse } from './lib/tap-response';
export { mapResponse } from './lib/map-response';
