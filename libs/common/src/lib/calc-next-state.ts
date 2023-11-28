import { StateOrCallback } from './models';
import { isFunction } from './is-function';

export function calcNextState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
    const newPartialState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback;
    return {
        ...state,
        ...newPartialState,
    };
}
