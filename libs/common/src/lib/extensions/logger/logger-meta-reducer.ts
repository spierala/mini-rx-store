import { Action, Reducer } from '../../models';
import { beautifyAction } from '../../beautify-action';

export function loggerMetaReducer(reducer: Reducer<any>): Reducer<any> {
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
