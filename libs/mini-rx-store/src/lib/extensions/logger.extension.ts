import {
    Action,
    ExtensionId,
    HasComponentStoreSupport,
    MetaReducer,
    Reducer,
    StoreExtension,
} from '../models';
import StoreCore from '../store-core';
import { beautifyActionForLogging } from '../utils';

export class LoggerExtension extends StoreExtension implements HasComponentStoreSupport {
    id = ExtensionId.LOGGER;

    init(): void {
        StoreCore.addMetaReducers(loggerMetaReducer);
    }

    initForCs(): MetaReducer<any> {
        return loggerMetaReducer;
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
