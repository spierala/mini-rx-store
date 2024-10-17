import { AppState, StoreConfig } from '@mini-rx/common';
import { storeCore } from './store-core';

export class Store {
    dispatch = storeCore.dispatch;
    select = storeCore.appState.select;

    constructor(config: StoreConfig<AppState>) {
        storeCore.configureStore(config);
    }
}
