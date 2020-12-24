import { Observable } from 'rxjs';
import { Action, AppState, Reducer, StoreExtension } from './interfaces';
import StoreCore from './store-core';

// Expose public store API
class Store {
    feature<StateType>(featureName: string, reducer: Reducer<StateType>) {
        StoreCore.addFeature<StateType>(featureName, reducer);
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

// Created once to initialize singleton
export default new Store();

export const actions$ = StoreCore.actions$;
