import { tap } from 'rxjs/operators';
import { Action, AppState, StoreExtension } from '../models';
import { beautifyAction } from '../beautify-action';
import { miniRxError } from '../mini-rx-error';
import { Observable } from 'rxjs';
import { ExtensionId } from '../enums';

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

export abstract class AbstractReduxDevtoolsExtension extends StoreExtension {
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

            this.actions$
                .pipe(
                    tap((action) => {
                        const appState = this.readState();
                        const actionForDevTools: Action = beautifyAction(action);
                        this.devtoolsConnection.send(actionForDevTools, appState);
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

    abstract updateState(state: AppState): void;

    abstract readState(): AppState;

    abstract get actions$(): Observable<Action>;
}

const enum DevToolActions {
    DISPATCH = 'DISPATCH',
    JUMP_TO_STATE = 'JUMP_TO_STATE',
    JUMP_TO_ACTION = 'JUMP_TO_ACTION',
}
