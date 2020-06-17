import { Observable } from 'rxjs';
import {
    Action,
    AppState,
    Reducer,
    Settings,
    StoreExtension,
} from './interfaces';
import StoreCore from './store-core';

// Expose public store API
class Store {
    feature<StateType>(
        featureName: string,
        reducer: Reducer<StateType>,
        initialState?: StateType
    ) {
        StoreCore.addFeature<StateType>(featureName, initialState, reducer);
    }

    createEffect(effect: Observable<Action>) {
        StoreCore.createEffect(effect);
    }

    addExtension(extension: StoreExtension) {
        StoreCore.addExtension(extension);
    }

    settings(settings: Partial<Settings>) {
        StoreCore.settings = settings;
    }

    dispatch = (action: Action) => StoreCore.dispatch(action);

    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return StoreCore.select(mapFn);
    }
}

// Created once to initialize singleton
export default new Store();

export const actions$ = StoreCore.actions$;
