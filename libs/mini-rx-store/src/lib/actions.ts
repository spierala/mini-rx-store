import { StateOrCallback, Action } from './models';
import { miniRxNameSpace } from './constants';

export const enum MiniRxActionType {
    INIT_STORE = 'init-store',
    INIT_FEATURE = 'init-feature',
    DESTROY_FEATURE = 'destroy-feature',
    SET_STATE = 'set-state',
    INIT_COMPONENT_STORE = 'init-component-store',
}

export interface SetStateAction<T> {
    type: string; // The action type visible in DevTools / Logging Extension (really only for logging!)
    stateOrCallback: StateOrCallback<T>; // Used in feature reducer to calc new state
    featureId: string; // Links the feature reducer to its corresponding FeatureStore
    featureKey: string; // Used in DevTools / Logging Extension to calculate the action payload (see `mapSetStateActionToActionWithPayload`)
    miniRxActionType: MiniRxActionType; // Used for `isSetStateAction` type predicate
}

export function createMiniRxActionType(miniRxActionType: MiniRxActionType, featureKey?: string) {
    return miniRxNameSpace + (featureKey ? '/' + featureKey : '') + '/' + miniRxActionType;
}

export function createMiniRxAction(
    miniRxActionType:
        | MiniRxActionType.INIT_STORE
        | MiniRxActionType.INIT_FEATURE
        | MiniRxActionType.DESTROY_FEATURE
        | MiniRxActionType.INIT_COMPONENT_STORE,
    featureKey?: string
): Action {
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey),
    };
}

// Type predicate
export function isSetStateAction<T>(action: Action): action is SetStateAction<T> {
    const key: keyof SetStateAction<any> = 'miniRxActionType';
    return action[key] === MiniRxActionType.SET_STATE;
}

export const UNDO_ACTION = miniRxNameSpace + '/undo';

export function undo(action: Action) {
    return {
        type: UNDO_ACTION,
        payload: action,
    };
}
