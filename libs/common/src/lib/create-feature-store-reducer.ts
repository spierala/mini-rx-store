import { Action, Reducer } from './models';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';

export function createFeatureStoreReducer<StateType>(
    featureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        return isMiniRxAction<StateType>(action) && action.featureId === featureId
            ? calcNextState(state, action.stateOrCallback)
            : state;
    };
}
