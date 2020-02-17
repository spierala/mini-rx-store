import { actions$, MiniStore } from './mini-store-base';
import { AppState, MiniStoreExtension } from './mini-store.utils';
import { tap, withLatestFrom } from 'rxjs/operators';

const win = window as any;

export class ReduxDevtoolsExtension implements MiniStoreExtension {
    private devtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    private devtoolsConnection: any;
    protected stateUpdateFn: (state: AppState) => void;

    constructor() {
    }

    init(stateUpdateFn?: (state: AppState) => void) {
        if (this.devtoolsExtension) {
            this.stateUpdateFn = stateUpdateFn;
            this.devtoolsConnection = win.__REDUX_DEVTOOLS_EXTENSION__.connect();

            actions$.pipe(
                withLatestFrom(MiniStore.select(state => state)),
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
        this.stateUpdateFn(state);
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
