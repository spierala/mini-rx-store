import { tap, withLatestFrom } from 'rxjs/operators';
import { AppState, StoreExtension } from '../models';
import StoreCore from '../store-core';

const win = window as any;

const defaultOptions: Partial<ReduxDevtoolsOptions> = {
    name: 'MiniRx - Redux Dev Tools',
};

export interface ReduxDevtoolsOptions {
    name: string;
    maxAge: number;
    latency: number;
}

export class ReduxDevtoolsExtension extends StoreExtension {
    private devtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    private devtoolsConnection: any;

    constructor(private readonly options: Partial<ReduxDevtoolsOptions>) {
        super();

        this.options = {
            ...defaultOptions,
            ...this.options,
        };
    }

    init() {
        if (this.devtoolsExtension) {
            this.devtoolsConnection = this.devtoolsExtension.connect(this.options);

            StoreCore.actions$
                .pipe(
                    withLatestFrom(StoreCore.state$),
                    tap(([action, state]) => this.devtoolsConnection.send(action, state))
                )
                .subscribe();

            this.devtoolsConnection.subscribe(this.onDevToolsMessage.bind(this));
        }
    }

    private onDevToolsMessage(message: {type: string, payload: any, state: any}) {
        if (message.type === DevToolActions.DISPATCH) {
            switch (message.payload.type) {
                case DevToolActions.JUMP_TO_STATE:
                case DevToolActions.JUMP_TO_ACTION:
                    this.updateState(JSON.parse(message.state));
            }
        }
    }

    protected updateState(state: AppState) {
        StoreCore.updateState(state);
    }
}

const enum DevToolActions {
    DISPATCH = 'DISPATCH',
    JUMP_TO_STATE = 'JUMP_TO_STATE',
    JUMP_TO_ACTION = 'JUMP_TO_ACTION',
}
