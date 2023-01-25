import { tap, withLatestFrom } from 'rxjs/operators';
import { Action, AppState, ExtensionId, StoreExtension } from '../models';
import { actions$, appState } from '../store-core';
import { beautifyActionForLogging, miniRxError } from '../utils';

const defaultOptions: Partial<ReduxDevtoolsOptions> = {
    name: 'MiniRx - Redux DevTools',
    traceLimit: 25,
};

export interface ReduxDevtoolsOptions {
    name: string;
    maxAge: number;
    latency: number;
    trace: boolean;
    traceLimit: number;
}

export class ReduxDevtoolsExtension extends StoreExtension {
    id = ExtensionId.REDUX_DEVTOOLS;

    private readonly devtoolsExtension: any;
    private devtoolsConnection: any;
    private readonly _optionsForNgExtension: Partial<ReduxDevtoolsOptions>;

    get optionsForNgExtension(): Partial<ReduxDevtoolsOptions> {
        return this._optionsForNgExtension;
    }

    constructor(private readonly options: Partial<ReduxDevtoolsOptions>) {
        super();

        if (!window) {
            miniRxError('The Redux DevTools are only supported in browser environments.');
        }

        this._optionsForNgExtension = options;

        this.devtoolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

        this.options = {
            ...defaultOptions,
            ...this.options,
        };
    }

    init(): void {
        if (this.devtoolsExtension) {
            this.devtoolsConnection = this.devtoolsExtension.connect(this.options);

            actions$
                .pipe(
                    withLatestFrom(appState.select()),
                    tap(([action, state]) => {
                        const actionForDevTools: Action = beautifyActionForLogging(action, state);
                        this.devtoolsConnection.send(actionForDevTools, state);
                    })
                )
                .subscribe();

            this.devtoolsConnection.subscribe(this.onDevToolsMessage.bind(this));
        }
    }

    private onDevToolsMessage(message: { type: string; payload: any; state: any }) {
        if (message.type === DevToolActions.DISPATCH) {
            switch (message.payload.type) {
                case DevToolActions.JUMP_TO_STATE:
                case DevToolActions.JUMP_TO_ACTION:
                    this.updateState(JSON.parse(message.state));
            }
        }
    }

    protected updateState(state: AppState) {
        appState.set(state);
    }
}

const enum DevToolActions {
    DISPATCH = 'DISPATCH',
    JUMP_TO_STATE = 'JUMP_TO_STATE',
    JUMP_TO_ACTION = 'JUMP_TO_ACTION',
}
