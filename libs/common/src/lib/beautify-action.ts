import { Action, MiniRxAction } from '../lib/models';
import { isMiniRxAction } from './is-mini-rx-action';
import { StoreType } from './enums';

// Only display type and payload in the LoggingExtension and Redux DevTools
export function beautifyAction(action: Action | MiniRxAction<any>): Action {
    if (
        isMiniRxAction(action, StoreType.FEATURE_STORE) ||
        isMiniRxAction(action, StoreType.COMPONENT_STORE)
    ) {
        return {
            type: action.type,
            payload: action.stateOrCallback,
        };
    }
    return action;
}
