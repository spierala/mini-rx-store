/*
 * Public API Surface of mini-rx-store
 */

export { Store, configureStore } from './lib/store';
export { actions$ } from './lib/store-core';
export { FeatureStore, createFeatureStore } from './lib/feature-store';
export {
    ComponentStore,
    createComponentStore,
    configureComponentStores,
} from './lib/component-store';
export {
    createFeatureSelector,
    createSelector,
    createFeatureStateSelector,
    createComponentStateSelector,
} from './lib/selector';
export {
    Action,
    Reducer,
    Actions,
    ReducerDictionary,
    StoreConfig,
    FeatureConfig,
    ComponentStoreConfig,
} from './lib/models';
export { ofType, hasEffectMetaData } from './lib/utils';
export { ReduxDevtoolsExtension } from './lib/extensions/redux-devtools.extension';
export {
    LoggerExtension,
    ReduxDevtoolsOptions,
    UndoExtension,
    ExtensionId,
    StoreExtension,
    ImmutableStateExtension,
} from '@mini-rx/common';
export { tapResponse } from './lib/tap-response';
export { mapResponse } from './lib/map-response';
export { createEffect } from './lib/create-effect';
export { undo } from './lib/actions';

// Attention: The API of StoreCore is meant of internal use, e.g. for the Angular `NgReduxDevtoolsService`
// The StoreCore API can change anytime soon!
export * as _StoreCore from './lib/store-core';
