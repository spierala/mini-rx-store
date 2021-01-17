import { Observable } from 'rxjs';
import {
    Action,
    AppState,
    FeatureStoreConfig,
    Reducer,
    StoreConfig,
    StoreExtension,
} from './models';
import StoreCore from './store-core';
import { FeatureStore } from './feature-store';
import { miniRxError } from './utils';

export class Store {
    private static instance: Store;

    // Prevent direct construction calls with the `new` operator.
    private constructor() {}

    /** @deprecated This is an internal implementation detail, do not use. */
    static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    feature<StateType>(
        featureName: string,
        reducer: Reducer<StateType>,
        config?: FeatureStoreConfig<StateType>
    ) {
        StoreCore.addFeature<StateType>(featureName, reducer, config);
    }

    createEffect(effect: Observable<Action>) {
        StoreCore.createEffect(effect);
    }

    dispatch = (action: Action) => StoreCore.dispatch(action);

    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return StoreCore.select(mapFn);
    }

    /** @deprecated This is an internal implementation detail, do not use. */
    _addExtension(extension: StoreExtension) {
        StoreCore.addExtension(extension);
    }
}

let store: Store;

export function configureStore(config?: Partial<StoreConfig>): Store {
    if (store) {
        miniRxError('Store is already configured. Did you call `configureStore` multiple times?');
        return store;
    }
    store = Store.getInstance();
    StoreCore.config(config);
    return store;
}

export function createFeatureStore<T>(featureName: string, initialState: T): FeatureStore<T> {
    return new FeatureStore<T>(featureName, initialState);
}

export const actions$ = StoreCore.actions$;
