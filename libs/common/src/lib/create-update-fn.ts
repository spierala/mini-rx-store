import { Action, OperationType, StateOrCallback, UpdateStateCallback } from './models';

export function createUpdateFn<StateType>(updateStateCallback: UpdateStateCallback<StateType>) {
    return (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
        return updateStateCallback(stateOrCallback, OperationType.SET_STATE, name);
    };
}
