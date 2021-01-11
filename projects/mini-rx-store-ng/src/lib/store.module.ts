import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Actions, actions$, Store, ReducerDictionary, Reducer } from 'mini-rx-store';
import { createStore } from '../../../mini-rx-store/src/lib/store';

export const REDUCERS = new InjectionToken<ReducerDictionary>('@mini-rx/reducers');
export const FEATURE_NAME = new InjectionToken<string>('@mini-rx/feature_name');
export const FEATURE_REDUCER = new InjectionToken<Reducer<any>>('@mini-rx/feature_reducer');

const storeFactory = (reducers: ReducerDictionary) => {
    return createStore(reducers); // TODO config
};

@NgModule()
export class StoreRootModule {}

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
                    useFactory: storeFactory,
                    deps: [REDUCERS],
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
