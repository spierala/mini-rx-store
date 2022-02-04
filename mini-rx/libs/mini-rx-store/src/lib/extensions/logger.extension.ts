import { Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';

export class LoggerExtension extends StoreExtension {
    init(): void {
        StoreCore.addMetaReducers(loggerMetaReducer);
    }
}

function loggerMetaReducer(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        const nextState = reducer(state, action);

        console.log(
            '%c' + action.type,
            'color: #25c2a0',
            '\nAction:',
            action,
            '\nState: ',
            nextState
        );

        return nextState;
    };
}
