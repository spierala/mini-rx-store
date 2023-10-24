import { Action, AppState, AbstractReduxDevtoolsExtension } from '@mini-rx/common';
import { Observable } from 'rxjs';
import { actions$, select, updateAppState } from '../store-core';

export class ReduxDevtoolsExtension extends AbstractReduxDevtoolsExtension {
    get actions$(): Observable<Action> {
        return actions$;
    }

    readState(): AppState {
        const signalState = select();
        return signalState();
    }

    updateState(state: AppState): void {
        updateAppState(state);
    }
}
