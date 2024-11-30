import { AbstractReduxDevtoolsExtension, Action, AppState } from '@mini-rx/common';
import { actions$, storeCore } from '../store-core';
import { Observable } from 'rxjs';

export class ReduxDevtoolsExtension extends AbstractReduxDevtoolsExtension {
    get actions$(): Observable<Action> {
        return actions$;
    }

    readState(): AppState {
        return storeCore.appState.get();
    }

    updateState(state: AppState): void {
        storeCore.appState.set(state);
    }
}
