import { Action, OperationType, StateOrCallback, UpdateStateCallback } from '@mini-rx/common';

// TODO move to common?
export function createUpdateFn<StateType>(updateStateCallback: UpdateStateCallback<StateType>) {
    return (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
        return updateStateCallback(stateOrCallback, OperationType.SET_STATE, name);
    };
}
