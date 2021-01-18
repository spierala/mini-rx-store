import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import {
    Actions,
    actions$,
    Store,
    ReducerDictionary,
    Reducer,
    configureStore,
    StoreConfig,
    FeatureStoreConfig,
} from 'mini-rx-store';

export const STORE_CONFIG = new InjectionToken<StoreConfig>('@mini-rx/store-config');
export const FEATURE_NAME = new InjectionToken<string>('@mini-rx/feature-name');
export const FEATURE_REDUCER = new InjectionToken<Reducer<any>>('@mini-rx/feature-reducer');
export const FEATURE_CONFIG = new InjectionToken<StoreConfig>('@mini-rx/feature-store-config');

const storeFactory = (config: StoreConfig) => {
    return configureStore(config);
};

@NgModule()
export class StoreRootModule {
    constructor(
        private store: Store // Make sure store is initialized also if it is NOT injected in other services/components
    ) {}
}

@NgModule()
export class StoreFeatureModule {
    constructor(
        private store: Store,
        root: StoreRootModule, // Prevent feature states to be initialized before root state
        @Inject(FEATURE_NAME) featureName: string,
        @Inject(FEATURE_REDUCER) reducer: Reducer<any>,
        @Inject(FEATURE_CONFIG) config: FeatureStoreConfig<any>
    ) {
        this.store.feature(featureName, reducer, config);
    }
}

@NgModule()
export class StoreModule {
    static forRoot(config: Partial<StoreConfig>): ModuleWithProviders<StoreRootModule> {
        return {
            ngModule: StoreRootModule,
            providers: [
                { provide: STORE_CONFIG, useValue: config },
                {
                    provide: Store,
                    useFactory: storeFactory,
                    deps: [STORE_CONFIG],
                },
                {
                    provide: Actions,
                    useValue: actions$,
                },
            ],
        };
    }

    static forFeature<T>(
        featureName: string,
        reducer: Reducer<T>,
        config?: Partial<FeatureStoreConfig<T>>
    ): ModuleWithProviders<StoreFeatureModule> {
        return {
            ngModule: StoreFeatureModule,
            providers: [
                { provide: FEATURE_NAME, useValue: featureName },
                { provide: FEATURE_REDUCER, useValue: reducer },
                { provide: FEATURE_CONFIG, useValue: config },
            ],
        };
    }
}
