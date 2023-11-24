import { Action, Reducer } from './models';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';

export function createComponentStoreReducer<StateType>(
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        if (isMiniRxAction<StateType>(action)) {
            return calcNextState(state, action.stateOrCallback);
        }
        return state;
    };
}
