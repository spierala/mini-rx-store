import { Action, AppState, FeatureConfig, Reducer, StoreConfig } from './models';
import StoreCore from './store-core';
import { miniRxError } from './utils';
import { Observable } from 'rxjs';

export class Store {
    private static instance: Store | undefined = undefined;

    // Public Store API
    feature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config?: FeatureConfig<StateType>
    ) {
        StoreCore.addFeature<StateType>(featureKey, reducer, config);
    }

    dispatch: (action: Action) => void = StoreCore.dispatch.bind(StoreCore);
    select: <R>(mapFn: (state: AppState) => R) => Observable<R> = StoreCore.appState.select.bind(
        StoreCore.appState
    );
    effect = StoreCore.effect.bind(StoreCore);

    // Prevent direct construction calls with the `new` operator.
    private constructor(config: Partial<StoreConfig<AppState>>) {
        StoreCore.config(config);
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

export const actions$ = StoreCore.actions$;
