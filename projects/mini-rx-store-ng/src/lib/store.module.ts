import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import {
    Actions,
    actions$,
    Store,
    Reducer,
    configureStore,
    StoreConfig,
    ReducerDictionary,
} from 'mini-rx-store';

export const STORE_CONFIG = new InjectionToken<ReducerDictionary>('@mini-rx/store-config');
export const FEATURE_NAME = new InjectionToken<string>('@mini-rx/feature-name');
export const FEATURE_REDUCER = new InjectionToken<Reducer<any>>('@mini-rx/feature-reducer');

export function storeFactory(config: StoreConfig) {
    return configureStore(config);
}

@NgModule()
export class StoreRootModule {
    constructor(
        // TODO is this really necessary?
        private store: Store // Make sure store is initialized also if it is NOT injected in other services/components
    ) {}
}

@NgModule()
export class StoreFeatureModule {
    constructor(
        private store: Store,
        root: StoreRootModule, // Prevent feature states to be initialized before root state
        @Inject(FEATURE_NAME) featureName: string,
        @Inject(FEATURE_REDUCER) reducer: Reducer<any>
    ) {
        this.store.feature(featureName, reducer);
    }
}

@NgModule()
export class StoreModule {
    static forRoot(config?: Partial<StoreConfig>): ModuleWithProviders<StoreRootModule> {
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
        reducer: Reducer<T>
    ): ModuleWithProviders<StoreFeatureModule> {
        return {
            ngModule: StoreFeatureModule,
            providers: [
                { provide: FEATURE_NAME, useValue: featureName },
                { provide: FEATURE_REDUCER, useValue: reducer },
            ],
        };
    }
}
