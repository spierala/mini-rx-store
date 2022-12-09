import { Action, Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';
import { beautifyActionForLogging } from '../utils';

export class LoggerExtension extends StoreExtension {
    override metaReducer = loggerMetaReducer;

    init(): void {
        StoreCore.addMetaReducers(this.metaReducer);
    }
}

function loggerMetaReducer(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        const actionToLog: Action = beautifyActionForLogging(action, state);

        const nextState = reducer(state, action);

        console.log(
            '%c' + action.type,
            'color: #25c2a0',
            '\nAction:',
            actionToLog,
            '\nState: ',
            nextState
        );

        return nextState;
    };
}
