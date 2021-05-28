import { Observable } from 'rxjs';
import { Action, AppState, FeatureStoreConfig, Reducer, StoreConfig } from './models';
import StoreCore from './store-core';
import { FeatureStore } from './feature-store';
import { miniRxError } from './utils';

export class Store {
    private static instance: Store = undefined;

    // Prevent direct construction calls with the `new` operator.
    private constructor(config: Partial<StoreConfig<AppState>>) {
        StoreCore.config(config);
    }

    /** @deprecated This is an internal implementation detail, do not use. */
    static configureStore(config: Partial<StoreConfig<AppState>>) {
        if (!Store.instance) {
            Store.instance = new Store(config);
            return Store.instance;
        }
        miniRxError('`configureStore` was called multiple times.');
    }

    feature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config?: FeatureStoreConfig<StateType>
    ) {
        StoreCore.addFeature<StateType>(featureKey, reducer, config);
    }

    effect(effect: Observable<Action>) {
        StoreCore.effect(effect);
    }

    dispatch = (action: Action) => StoreCore.dispatch(action);

    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return StoreCore.select(mapFn);
    }
}

export function configureStore<T>(config: Partial<StoreConfig<T>>): Store {
    return Store.configureStore(config);
}

export function createFeatureStore<T>(featureKey: string, initialState: T): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState);
}

export const actions$ = StoreCore.actions$;
