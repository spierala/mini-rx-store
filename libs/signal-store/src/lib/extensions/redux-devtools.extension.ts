import { Action, AppState, AbstractReduxDevtoolsExtension } from '@mini-rx/common';
import { Observable } from 'rxjs';
import { actions$, selectableAppState, updateAppState } from '../store-core';

export class ReduxDevtoolsExtension extends AbstractReduxDevtoolsExtension {
    get actions$(): Observable<Action> {
        return actions$;
    }

    readState(): AppState {
        const signalState = selectableAppState.select();
        return signalState();
    }

    updateState(state: AppState): void {
        updateAppState(state);
    }
}
