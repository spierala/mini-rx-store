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
export { ReduxDevtoolsExtension } from './lib/extensions/redux-devtools.extension';
export {
    StoreConfig,
    FeatureConfig,
    ComponentStoreConfig,
    LoggerExtension,
    ReduxDevtoolsOptions,
    UndoExtension,
    ExtensionId,
    StoreExtension,
    ImmutableStateExtension,
    Action,
    Actions,
    Reducer,
    ReducerDictionary,
    undo,
    mapResponse,
    tapResponse,
    createRxEffect as createEffect,
    hasEffectMetaData,
    ofType,
} from '@mini-rx/common';
