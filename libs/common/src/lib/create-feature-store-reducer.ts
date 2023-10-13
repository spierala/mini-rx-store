import { Action, Reducer } from './models';
import { StoreType } from './enums';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';

export function createFeatureStoreReducer<StateType>(
    featureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (
            isMiniRxAction<StateType>(action, StoreType.FEATURE_STORE) &&
            action.featureId === featureId
        ) {
            return calcNextState(state, action.stateOrCallback);
        }
        return state;
    };
}
