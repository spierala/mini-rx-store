import { AppState, StoreConfig } from './models';
import { configureStore, dispatch, rxEffect, selectableAppState } from './store-core';
import { Inject, Injectable } from '@angular/core';
import { STORE_CONFIG } from './ng-modules/store.module';

@Injectable()
export class Store {
    dispatch = dispatch;
    rxEffect = rxEffect;
    select = selectableAppState.select.bind(selectableAppState);

    constructor(@Inject(STORE_CONFIG) config: StoreConfig<AppState>) {
        configureStore(config);
    }
}
