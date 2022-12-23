/*
 * Public API Surface of mini-rx-store
 */

export { actions$, Store, configureStore } from './lib/store';
export { FeatureStore, createFeatureStore } from './lib/feature-store';
export {
    ComponentStore,
    createComponentStore,
    configureComponentStores,
} from './lib/component-store';
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
export { ofType, hasEffectMetaData } from './lib/utils';
export {
    ReduxDevtoolsExtension,
    ReduxDevtoolsOptions,
} from './lib/extensions/redux-devtools.extension';
export { LoggerExtension } from './lib/extensions/logger.extension';
export { ImmutableStateExtension } from './lib/extensions/immutable-state.extension';
export { UndoExtension } from './lib/extensions/undo.extension';
export { tapResponse } from './lib/tap-response';
export { mapResponse } from './lib/map-response';
export { createEffect } from './lib/create-effect';
export { undo } from './lib/actions';

// Attention: The API of StoreCore is meant of internal use, e.g. for the Angular `NgReduxDevtoolsService`
// The StoreCore API can change anytime soon!
export { default as _StoreCore } from './lib/store-core';
