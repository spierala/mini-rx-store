import { Observable } from 'rxjs';
import { Action, AppState, MiniStoreExtension, Reducer, Settings } from './interfaces';
import MiniStoreCore from './mini-store-core';
import { MiniFeature } from './mini-feature';

// Expose public store API
class MiniStore {
    feature<StateType>(
        featureName: string,
        initialState: StateType = {} as StateType,
        reducer?: Reducer<StateType>
    ): MiniFeature<StateType> {
        return new MiniFeature(featureName, initialState, reducer);
    }

    createEffect(effect: Observable<Action>) {
        MiniStoreCore.createEffect(effect);
    }

    addExtension(extension: MiniStoreExtension) {
        MiniStoreCore.addExtension(extension);
    }

    set settings(settings: Partial<Settings>) {
        MiniStoreCore.settings = settings;
    }

    dispatch = (action: Action) => MiniStoreCore.dispatch(action);


    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return MiniStoreCore.select(mapFn);
    }
}

// Created once to initialize singleton
export default new MiniStore();

export const actions$ = MiniStoreCore.actions$;
