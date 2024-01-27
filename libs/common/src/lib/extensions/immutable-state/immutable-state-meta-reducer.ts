import { Action, Reducer } from '../../models';
import { deepFreeze } from '../../deep-freeze';

export function immutableStateMetaReducer(reducer: Reducer<any>): Reducer<any> {
    return (state, action: Action) => {
        if (state) {
            deepFreeze(state);
        }
        const nextState = reducer(state, action);
        deepFreeze(nextState);
        return nextState;
    };
}
