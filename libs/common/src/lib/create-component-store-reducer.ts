import { Action, Reducer } from './models';
import { StoreType } from './enums';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';

export function createComponentStoreReducer<StateType>(
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        if (isMiniRxAction<StateType>(action, StoreType.COMPONENT_STORE)) {
            return calcNextState(state, action.stateOrCallback);
        }
        return state;
    };
}
