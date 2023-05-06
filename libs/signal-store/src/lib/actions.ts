import { Action, StateOrCallback } from './models';
import { miniRxNameSpace } from './constants';

export const enum MiniRxActionType {
    INIT = 'init',
    DESTROY = 'destroy',
    SET_STATE = 'set-state',
}

export const enum SetStateActionType {
    FEATURE_STORE = '@mini-rx/feature-store',
    COMPONENT_STORE = '@mini-rx/component-store',
}

export interface FeatureStoreSetStateAction<T> {
    setStateActionType: SetStateActionType.FEATURE_STORE; // Used for type predicate `isFeatureStoreSetStateAction`
    stateOrCallback: StateOrCallback<T>; // Used in feature reducer to calc new state
    type: string; // The action type visible in DevTools / Logging Extension (really only for logging!)
    featureId: string; // Links the feature reducer to its corresponding FeatureStore
    featureKey: string; // Used in Redux DevTools / Logging Extension to calculate the action payload (see `beautifyActionForLogging`)
}

export interface ComponentStoreSetStateAction<T> {
    setStateActionType: SetStateActionType.COMPONENT_STORE; // Used for type predicate `isComponentStoreSetStateAction`
    stateOrCallback: StateOrCallback<T>; // Used in component store reducer to calc new state
    type: string; // The action type visible in DevTools / Logging Extension (really only for logging!)
}

// Union type
export type SetStateAction<T> = FeatureStoreSetStateAction<T> | ComponentStoreSetStateAction<T>;

export function createMiniRxActionType(miniRxActionType: MiniRxActionType, featureKey?: string) {
    return miniRxNameSpace + (featureKey ? '/' + featureKey : '') + '/' + miniRxActionType;
}

export function createMiniRxAction(
    miniRxActionType: MiniRxActionType.INIT | MiniRxActionType.DESTROY,
    featureKey?: string
): Action {
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey),
    };
}

const setStateActionTypeKey: keyof SetStateAction<any> = 'setStateActionType';

// Type predicate
export function isFeatureStoreSetStateAction<StateType>(
    action: Action
): action is FeatureStoreSetStateAction<StateType> {
    return action[setStateActionTypeKey] === SetStateActionType.FEATURE_STORE;
}

export function isComponentStoreSetStateAction<StateType>(
    action: Action
): action is ComponentStoreSetStateAction<StateType> {
    return action[setStateActionTypeKey] === SetStateActionType.COMPONENT_STORE;
}

export const UNDO_ACTION = miniRxNameSpace + '/undo';

export function undo(action: Action) {
    return {
        type: UNDO_ACTION,
        payload: action,
    };
}
