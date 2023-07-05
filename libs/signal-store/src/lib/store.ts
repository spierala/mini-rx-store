import { AppState, StoreConfig } from './models';
import { configureStore, dispatch, rxEffect, selectableAppState } from './store-core';

export class Store {
    dispatch = dispatch;
    rxEffect = rxEffect;
    select = selectableAppState.select.bind(selectableAppState);

    constructor(config: StoreConfig<AppState>) {
        configureStore(config);
    }
}
