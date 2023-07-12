import { AppState, StoreConfig } from './models';
import { configureStore, dispatch, selectableAppState } from './store-core';

export class Store {
    dispatch = dispatch;
    select = selectableAppState.select.bind(selectableAppState);

    constructor(config: StoreConfig<AppState>) {
        configureStore(config);
    }
}
