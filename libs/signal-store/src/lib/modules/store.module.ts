import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Actions, AppState, FeatureConfig, Reducer, StoreConfig } from '@mini-rx/common';
import { Store } from '../store';
import { actions$, addFeature } from '../store-core';

export const STORE_CONFIG = new InjectionToken<StoreConfig<any>>('@mini-rx/store-config');
export const FEATURE_NAMES = new InjectionToken<string[]>('@mini-rx/feature-name');
export const FEATURE_REDUCERS = new InjectionToken<Reducer<any>[]>('@mini-rx/feature-reducer');
export const FEATURE_CONFIGS = new InjectionToken<FeatureConfig<any>[]>(
    '@mini-rx/feature-store-config'
);

export function storeFactory(config: StoreConfig<AppState>) {
    return new Store(config);
}

@NgModule()
export class StoreRootModule {
    constructor(
        private store: Store // Make sure store is initialized also if it is NOT injected in other services/components
    ) {}
}

@NgModule()
export class StoreFeatureModule {
    constructor(
        root: StoreRootModule, // Prevent feature states to be initialized before root state
        @Inject(FEATURE_NAMES) featureNames: string[],
        @Inject(FEATURE_REDUCERS) reducers: Reducer<any>[],
        @Inject(FEATURE_CONFIGS) configs: FeatureConfig<any>[]
    ) {
        featureNames.forEach((featureName, index) => {
            addFeature(featureName, reducers[index], configs[index]);
        });
    }
}

@NgModule()
export class StoreModule {
    static forRoot<T>(config: StoreConfig<T>): ModuleWithProviders<StoreRootModule> {
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
        config?: Partial<FeatureConfig<T>>
    ): ModuleWithProviders<StoreFeatureModule> {
        return {
            ngModule: StoreFeatureModule,
            providers: [
                { provide: FEATURE_NAMES, multi: true, useValue: featureName },
                { provide: FEATURE_REDUCERS, multi: true, useValue: reducer },
                { provide: FEATURE_CONFIGS, multi: true, useValue: config },
            ],
        };
    }
}
