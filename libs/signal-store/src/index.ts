/*
 * Public API Surface of Signal Store
 */

export { Store } from './lib/store';
export { FeatureStore, createFeatureStore } from './lib/feature-store';
export { ComponentStore, createComponentStore } from './lib/component-store';
export {
    createSelector,
    createFeatureStateSelector,
    createComponentStateSelector,
} from './lib/signal-selector';
export { ReduxDevtoolsExtension } from './lib/extensions/redux-devtools.extension';
export { StoreRootModule, StoreModule, StoreFeatureModule } from './lib/modules/store.module';
export { EffectsModule } from './lib/modules/effects.module';
export { ComponentStoreModule } from './lib/modules/component-store.module';
export {
    provideStore,
    provideFeature,
    provideEffects,
    provideComponentStoreConfig,
} from './lib/providers';

// Re-export from @mini-rx/common
export {
    Action,
    Reducer,
    Actions,
    StoreConfig,
    FeatureConfig,
    FeatureStoreConfig,
    ComponentStoreConfig,
    StoreExtension,
    undo,
    tapResponse,
    createRxEffect,
    LoggerExtension,
    ImmutableStateExtension,
    UndoExtension,
    mapResponse,
    ReduxDevtoolsOptions,
    ofType,
} from '@mini-rx/common';
