import { AppState, FeatureStoreConfig, Reducer, StoreConfig } from './models';
import StoreCore from './store-core';
import { FeatureStore } from './feature-store';
import { miniRxError } from './utils';

export class Store {
    private static instance: Store | undefined = undefined;

    // Public Store API
    feature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config?: FeatureStoreConfig<StateType>
    ) {
        StoreCore.addFeature<StateType>(featureKey, reducer, config);
    }

    dispatch = StoreCore.dispatch.bind(StoreCore);
    select = StoreCore.select.bind(StoreCore);
    effect = StoreCore.effect.bind(StoreCore);

    // Prevent direct construction calls with the `new` operator.
    private constructor(config: Partial<StoreConfig<AppState>>) {
        StoreCore.config(config);
    }

    /** @deprecated This is an internal implementation detail, do not use. */
    static configureStore(config: Partial<StoreConfig<AppState>>): Store | never {
        if (!Store.instance) {
            Store.instance = new Store(config);
            return Store.instance;
        }
        miniRxError('`configureStore` was called multiple times.');
    }
}

export function configureStore<T>(config: Partial<StoreConfig<T>>): Store {
    return Store.configureStore(config);
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState);
}

export const actions$ = StoreCore.actions$;
