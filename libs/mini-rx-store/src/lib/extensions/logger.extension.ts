import { Action, Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';
import { beautifyActionsForLogging } from '../utils';

export class LoggerExtension extends StoreExtension {
    init(): void {
        StoreCore.addMetaReducers(loggerMetaReducer);
    }
}

function loggerMetaReducer(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        let actionToLog: Action = beautifyActionsForLogging(action, state);

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
