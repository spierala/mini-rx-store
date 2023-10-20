import { Action, MiniRxAction } from './models';

const stateOrCallbackKey: keyof MiniRxAction<any> = 'stateOrCallback';

// Type predicate
export function isMiniRxAction<StateType>(action: Action): action is MiniRxAction<StateType> {
    return Object.hasOwn(action, stateOrCallbackKey);
}
