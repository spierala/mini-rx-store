import { tap, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, AppState, MiniStoreExtension } from '../interfaces';

const win = window as any;

export class ReduxDevtoolsExtension implements MiniStoreExtension {
    private devtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    private devtoolsConnection: any;
    private stateSource: Subject<AppState>;

    constructor() {
    }

    init(stateSource: BehaviorSubject<AppState>, state$: Observable<AppState>, actions$: Observable<Action>) {
        this.stateSource = stateSource;

        if (this.devtoolsExtension) {
            this.devtoolsConnection = win.__REDUX_DEVTOOLS_EXTENSION__.connect();

            actions$.pipe(
                withLatestFrom(state$),
                tap(([action, state]) => this.devtoolsConnection.send(action, state))
            ).subscribe();

            this.devtoolsConnection.subscribe(message => {
                if (message.type === Actions.DISPATCH) {
                    switch (message.payload.type) {
                        case Actions.JUMP_TO_STATE:
                        case Actions.JUMP_TO_ACTION:
                            this.updateState(JSON.parse(message.state));
                    }
                }
            });
        }
    }

    updateState(state: AppState) {
        this.stateSource.next(state);
    }
}

enum Actions {
    DISPATCH = 'DISPATCH',
    JUMP_TO_STATE = 'JUMP_TO_STATE',
    JUMP_TO_ACTION = 'JUMP_TO_ACTION',
    REDUX_DEVTOOLS_JUMP = 'REDUX_DEVTOOLS_JUMP',
    ROUTE_NAVIGATION = 'ROUTE_NAVIGATION',
    IMPORT_STATE = 'IMPORT_STATE'
}
