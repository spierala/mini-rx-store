import { Action, Reducer } from './models';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';

export function createComponentStoreReducer<StateType>(
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        return isMiniRxAction<StateType>(action)
            ? calcNextState(state, action.stateOrCallback)
            : state;
    };
}
