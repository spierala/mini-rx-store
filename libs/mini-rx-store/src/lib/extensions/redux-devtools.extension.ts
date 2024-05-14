import { AbstractReduxDevtoolsExtension, Action, AppState } from '@mini-rx/common';
import { actions$, appState } from '../store-core';
import { Observable } from 'rxjs';

export class ReduxDevtoolsExtension extends AbstractReduxDevtoolsExtension {
    get actions$(): Observable<Action> {
        return actions$;
    }

    readState(): AppState {
        return appState.get()!;
    }

    updateState(state: AppState): void {
        appState.set(state);
    }
}
