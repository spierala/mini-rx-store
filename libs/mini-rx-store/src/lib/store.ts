import { Action, AppState, FeatureConfig, Reducer, StoreConfig } from './models';
import { miniRxError } from './utils';
import { Observable } from 'rxjs';
import {
    addFeature,
    appState,
    dispatch,
    effect,
    configureStore as _configureStore,
} from './store-core';

export abstract class Store {
    abstract feature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config?: FeatureConfig<StateType>
    ): void;
    abstract dispatch(action: Action): void;
    abstract select<R>(mapFn: (state: AppState) => R): Observable<R>;
    abstract effect(effect: Observable<any>): void;
}

let isStoreConfigured = false;

export function configureStore<T>(config: Partial<StoreConfig<T>>): Store | never {
    if (!isStoreConfigured) {
        _configureStore(config);
        isStoreConfigured = true;

        return {
            feature: addFeature,
            select: appState.select.bind(appState),
            dispatch,
            effect,
        };
    }
    miniRxError('`configureStore` was called multiple times.');
}
