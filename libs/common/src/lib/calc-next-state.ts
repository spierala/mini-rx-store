import { StateOrCallback } from './models';
import { isFunction } from './is-function';

export function calcNextState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
    return {
        ...state,
        ...(isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback), // new partial state
    };
}
