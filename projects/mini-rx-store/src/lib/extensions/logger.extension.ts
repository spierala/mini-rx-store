import { StoreExtension } from '../models';
import StoreCore from '../store-core';

export class LoggerExtension extends StoreExtension {
    init(): void {
        StoreCore.addMetaReducers(loggerMetaReducer);
    }
}

function loggerMetaReducer(reducer) {
    return (state, action) => {
        const nextState = reducer(state, action);

        console.log(
            '%cACTION',
            'font-weight: bold; color: #ff9900',
            '\nType:',
            action.type,
            '\nAction: ',
            action,
            '\nState: ',
            nextState
        );

        return nextState;
    };
}
