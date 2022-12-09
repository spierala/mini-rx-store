import { StateOrCallback, Action } from './models';
import { miniRxNameSpace } from './constants';

export const enum MiniRxActionType {
    INIT_STORE = 'init-store',
    INIT_FEATURE = 'init-feature',
    DESTROY_FEATURE = 'destroy-feature',
    SET_STATE = 'set-state',
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

export function createSetStateAction<T>(
    stateOrCallback: StateOrCallback<T>,
    featureId: string,
    featureKey: string,
    name?: string
): SetStateAction<T> {
    const miniRxActionType = MiniRxActionType.SET_STATE;
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey) + (name ? '/' + name : ''),
        stateOrCallback,
        featureId,
        featureKey,
        miniRxActionType,
    };
}

export function createMiniRxAction(
    miniRxActionType:
        | MiniRxActionType.INIT_STORE
        | MiniRxActionType.INIT_FEATURE
        | MiniRxActionType.DESTROY_FEATURE,
    featureKey?: string
): Action {
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey),
    };
}

const key: keyof SetStateAction<any> = 'miniRxActionType';
const type: MiniRxActionType = MiniRxActionType.SET_STATE;

// Type predicate
export function isSetStateAction<T>(action: Action): action is SetStateAction<T> {
    return action[key] === type;
}
