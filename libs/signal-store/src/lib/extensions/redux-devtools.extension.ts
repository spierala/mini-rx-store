import { AbstractReduxDevtoolsExtension, Action, AppState } from '@mini-rx/common';
import { Observable } from 'rxjs';
import { storeCore } from '../store-core';

export class ReduxDevtoolsExtension extends AbstractReduxDevtoolsExtension {
    get actions$(): Observable<Action> {
        return storeCore.actions$;
    }

    readState(): AppState {
        return storeCore.appState.get();
    }

    updateState(state: AppState): void {
        storeCore.appState.set(state);
    }
}
