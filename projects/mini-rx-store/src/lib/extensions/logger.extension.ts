import { ExtensionSortOrder, StoreExtension } from '../models';
import StoreCore from '../store-core';

export class LoggerExtension implements StoreExtension {
    sortOrder = ExtensionSortOrder.DEFAULT;

    init(): void {
        StoreCore.addMetaReducers(loggerMetaReducer);
    }
}

function loggerMetaReducer(reducer) {
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
