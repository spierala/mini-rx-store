import { Action, OperationType, StateOrCallback } from '@mini-rx/common';

export function createUpdateFn<StateType>(
    dispatch: (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ) => Action
) {
    function update(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        return dispatch(stateOrCallback, OperationType.SET_STATE, name);
    }

    return update;
}
