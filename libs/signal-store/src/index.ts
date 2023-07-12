/*
 * Public API Surface of signal-store
 */

export { Store } from './lib/store';
export { FeatureStore, createFeatureStore } from './lib/feature-store';
export {
    ComponentStore,
    createComponentStore,
    configureComponentStores,
} from './lib/component-store';
export {
    createSelector,
    createFeatureStateSelector,
    createComponentStateSelector,
} from './lib/signal-selector';
export {
    Action,
    Reducer,
    Actions,
    StoreConfig,
    FeatureConfig,
    ComponentStoreConfig,
    StoreExtension,
} from './lib/models';
export { ofType } from './lib/utils';
export {
    ReduxDevtoolsExtension,
    ReduxDevtoolsOptions,
} from './lib/extensions/redux-devtools.extension';
export { LoggerExtension } from './lib/extensions/logger.extension';
export { ImmutableStateExtension } from './lib/extensions/immutable-state.extension';
export { UndoExtension } from './lib/extensions/undo.extension';
export { tapResponse } from './lib/tap-response';
export { mapResponse } from './lib/map-response';
export { createRxEffect } from './lib/create-rx-effect';
export { undo } from './lib/actions';

export { StoreRootModule, StoreModule, StoreFeatureModule } from './lib/modules/store.module';
export { EffectsModule } from './lib/modules/effects.module';
export { ComponentStoreModule } from './lib/modules/component-store.module';
export {
    provideStore,
    provideFeature,
    provideEffects,
    provideComponentStoreConfig,
} from './lib/providers';
