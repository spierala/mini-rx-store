import { StoreExtension } from './interfaces';
import StoreCore from './store-core';

export class LoggerExtension implements StoreExtension {
    init(): void {
        StoreCore.addMetaReducer(logger);
    }
}

export function logger(reducer) {
    return function newReducer(state, action) {
        const nextState = reducer(state, action);

        console.log(
            '%cACTION',
            'font-weight: bold; color: #ff9900',
            '\nType:',
            action.type,
            '\nPayload: ',
            action.payload,
            '\nState: ',
            nextState
        );

        return nextState;
    };
}
