import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import {
    Actions,
    actions$,
    configureStore,
    ExtensionId,
    FeatureConfig,
    Reducer,
    ReduxDevtoolsExtension,
    Store,
    StoreConfig,
} from 'mini-rx-store';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';

export const STORE_CONFIG = new InjectionToken<StoreConfig<any>>('@mini-rx/store-config');
export const FEATURE_NAMES = new InjectionToken<string[]>('@mini-rx/feature-name');
export const FEATURE_REDUCERS = new InjectionToken<Reducer<any>[]>('@mini-rx/feature-reducer');
export const FEATURE_CONFIGS = new InjectionToken<FeatureConfig<any>[]>(
    '@mini-rx/feature-store-config'
);

export function storeFactory(config: StoreConfig<Record<string, any>>) {
    config.extensions = config.extensions?.map((ext) => {
        if (ext.id === ExtensionId.REDUX_DEVTOOLS) {
            // Use NgReduxDevtoolsExtension which uses NgZone.run (to make sure that Angular updates the View when using time-travel)
            return new NgReduxDevtoolsExtension(
                (ext as ReduxDevtoolsExtension).optionsForNgExtension
            );
        }
        return ext;
    });

    return configureStore(config);
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
        private store: Store,
        root: StoreRootModule, // Prevent feature states to be initialized before root state
        @Inject(FEATURE_NAMES) featureNames: string[],
        @Inject(FEATURE_REDUCERS) reducers: Reducer<any>[],
        @Inject(FEATURE_CONFIGS) configs: FeatureConfig<any>[]
    ) {
        featureNames.forEach((featureName, index) => {
            this.store.feature(featureName, reducers[index], configs[index]);
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
