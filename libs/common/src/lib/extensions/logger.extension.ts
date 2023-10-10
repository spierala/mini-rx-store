import { Action, HasComponentStoreSupport, MetaReducer, Reducer, StoreExtension } from '../models';
import { beautifyAction } from '../beautify-action';
import { ExtensionId } from '../enums';

export class LoggerExtension extends StoreExtension implements HasComponentStoreSupport {
    id = ExtensionId.LOGGER;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return loggerMetaReducer;
    }
}

function loggerMetaReducer(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        const actionToLog: Action = beautifyAction(action);

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
