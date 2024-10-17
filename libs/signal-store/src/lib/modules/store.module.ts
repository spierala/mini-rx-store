import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { Actions, AppState, FeatureConfig, Reducer, StoreConfig } from '@mini-rx/common';
import { Store } from '../store';
import { storeCore } from '../store-core';
import {
    FEATURE_CONFIGS,
    FEATURE_NAMES,
    FEATURE_REDUCERS,
    STORE_CONFIG,
} from '../injection-tokens';

export function storeFactory(config: StoreConfig<AppState>) {
    return new Store(config);
}

@NgModule()
export class StoreRootModule {
    private store = inject(Store); // Make sure store is initialized also if it is NOT injected in other services/components
}

@NgModule()
export class StoreFeatureModule {
    constructor() {
        const storeRootModule = inject(StoreRootModule); // Prevent feature states to be initialized before root state
        const featureNames: string[] = inject(FEATURE_NAMES);
        const reducers: Reducer<any>[] = inject(FEATURE_REDUCERS);
        const configs: FeatureConfig<any>[] = inject(FEATURE_CONFIGS);

        featureNames.forEach((featureName, index) => {
            storeCore.addFeature(featureName, reducers[index], configs[index]);
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
                    useValue: storeCore.actions$,
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
