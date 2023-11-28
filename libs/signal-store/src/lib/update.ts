import { Action, OperationType, StateOrCallback } from '@mini-rx/common';

export function createUpdateFn<StateType>(
    updateStateCallback: (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ) => Action
) {
    return (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
        return updateStateCallback(stateOrCallback, OperationType.SET_STATE, name);
    };
}
