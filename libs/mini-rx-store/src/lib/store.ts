import { Action, AppState, FeatureConfig, Reducer, StoreConfig } from './models';
import { getStoreCore, StoreCore } from './store-core';
import { miniRxError } from './utils';
import { Observable } from 'rxjs';

export class Store {
    private static instance: Store | undefined = undefined;
    private storeCore = getStoreCore();

    // Public Store API
    feature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config?: FeatureConfig<StateType>
    ) {
        this.storeCore.addFeature<StateType>(featureKey, reducer, config);
    }

    dispatch: (action: Action) => void = this.storeCore.dispatch.bind(this.storeCore);
    select: <R>(mapFn: (state: AppState) => R) => Observable<R> =
        this.storeCore.appState.select.bind(this.storeCore.appState);
    effect = this.storeCore.effect.bind(this.storeCore);

    // Prevent direct construction calls with the `new` operator.
    private constructor(config: Partial<StoreConfig<AppState>>) {
        this.storeCore.config(config);
    }

    /** @internal */
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
