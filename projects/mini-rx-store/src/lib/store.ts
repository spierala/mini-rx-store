import { Observable } from 'rxjs';
import {
    Action,
    AppState,
    Reducer,
    ReducerDictionary,
    StoreConfig,
    StoreExtension,
} from './models';
import StoreCore from './store-core';
import { FeatureStore } from './feature-store';
import { miniRxError } from './utils';

// Public Store API
export class Store {
    private static instance: Store;

    // Prevent direct construction calls with the `new` operator.
    private constructor() {}

    static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    feature<StateType>(
        featureName: string,
        reducer: Reducer<StateType>,
        config?: StoreConfig<StateType>
    ) {
        StoreCore.addFeature<StateType>(featureName, reducer); // TODO handle config
    }

    config(reducers: ReducerDictionary, config?: StoreConfig<AppState>) {
        StoreCore.config(reducers, config);
    }

    createEffect(effect: Observable<Action>) {
        StoreCore.createEffect(effect);
    }

    addExtension(extension: StoreExtension) {
        StoreCore.addExtension(extension);
    }

    dispatch = (action: Action) => StoreCore.dispatch(action);

    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return StoreCore.select(mapFn);
    }
}

let store: Store;

// Created once to initialize singleton
export function createStore(reducers: ReducerDictionary, config?: StoreConfig<AppState>): Store {
    if (store) {
        miniRxError('Store is already created. Did you call `createStore` multiple times?');
        return store;
    }
    store = Store.getInstance();
    store.config(reducers, config);
    return store;
}

export function createFeatureStore<T>(featureName: string, initialState: T): FeatureStore<T> {
    return new FeatureStore<T>(featureName, initialState);
}

export const actions$ = StoreCore.actions$;
