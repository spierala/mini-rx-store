import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { store, Store } from './store';
import { Reducer, ReducerDictionary } from './interfaces';

export const REDUCERS = new InjectionToken('__reducers__');
export const FEATURE_NAME = new InjectionToken('__feature_name__');
export const FEATURE_REDUCER = new InjectionToken('__feature_reducer__');

@NgModule()
export class StoreRootModule {
    constructor(@Inject(REDUCERS) reducers: ReducerDictionary, private store: Store) {
        this.store.config(reducers);
    }
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
    static forRoot(reducers: ReducerDictionary = {}): ModuleWithProviders<StoreRootModule> {
        return {
            ngModule: StoreRootModule,
            providers: [
                { provide: REDUCERS, useValue: reducers },
                {
                    provide: Store,
                    useValue: store,
                },
            ],
        };
    }

    static forFeature<T>(
        featureName: string,
        reducer: Reducer<any>
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
