import { tap, withLatestFrom } from 'rxjs/operators';
import { AppState, StoreExtension } from '../interfaces';
import { actions$ } from '../store';
import { default as Store } from '../store-core';

const win = window as any;

const defaultOptions: Partial<ReduxDevtoolsOptions> = {
    name: 'MiniRx - Redux Dev Tools'
};

export interface ReduxDevtoolsOptions {
    maxAge: number;
    name: string;
}

export class ReduxDevtoolsExtension implements StoreExtension {
    private devtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    private devtoolsConnection: any;

    constructor(
        private readonly options: Partial<ReduxDevtoolsOptions>
    ) {

        this.options = {
            ...defaultOptions,
            ...this.options
        };
    }

    init() {
        if (this.devtoolsExtension) {
            this.devtoolsConnection = win.__REDUX_DEVTOOLS_EXTENSION__.connect(this.options);

            actions$.pipe(
                withLatestFrom(Store.state$),
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
        Store.updateState(state);
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
