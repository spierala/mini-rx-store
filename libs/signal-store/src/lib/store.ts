import { AppState, StoreConfig } from '@mini-rx/common';
import { configureStore, dispatch, select } from './store-core';

export class Store {
    dispatch = dispatch;
    select = select;

    constructor(config: StoreConfig<AppState>) {
        configureStore(config);
    }
}
