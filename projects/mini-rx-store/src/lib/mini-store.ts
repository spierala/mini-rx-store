import { Observable } from 'rxjs';
import { Action, AppState, MiniStoreExtension, Settings } from './interfaces';
import { MiniStoreCore as Store, Reducer } from './mini-store-core';
import { MiniFeature } from './mini-feature';

namespace MiniRx {
    // Expose public store API
    export class MiniStore {
        feature<StateType>(
            featureName: string,
            initialState: StateType = {} as StateType,
            reducer?: Reducer<StateType>
        ): MiniFeature<StateType> {
            return new MiniFeature(featureName, initialState, reducer);
        }

        effects(effects: Observable<Action>[]) {
            Store.addEffects(effects);
        }

        addExtension(extension: MiniStoreExtension) {
            Store.addExtension(extension);
        }

        set settings(settings: Partial<Settings>) {
            Store.settings = settings;
        }

        dispatch = (action: Action) => Store.dispatch(action);

        select(mapFn: ((state: AppState) => any)): Observable<any> {
            return Store.select(mapFn);
        }
    }
}

export const MiniStore = new MiniRx.MiniStore(); // Created once to initialize singleton
