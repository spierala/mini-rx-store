import { Action, StateOrCallback } from './models';
import { miniRxNameSpace } from './constants';

export const enum OperationType {
    INIT = 'init',
    DESTROY = 'destroy',
    SET_STATE = 'set-state',
    CONNECTION = 'connection',
}

export const enum StoreType {
    FEATURE_STORE = '@mini-rx/feature-store',
    COMPONENT_STORE = '@mini-rx/component-store',
}

export type MiniRxAction<T> = {
    storeType: StoreType; // Used for type predicate `isMiniRxAction`
    stateOrCallback: StateOrCallback<T>; // Used in FeatureStore/ComponentStore reducer to calc new state
    type: string; // The action type visible in DevTools / Logging Extension
    featureId?: string; // Links the feature reducer to its corresponding FeatureStore
};

export function createMiniRxActionType(
    operationType: OperationType,
    featureKey?: string,
    name?: string
): string {
    return (
        miniRxNameSpace +
        (featureKey ? '/' + featureKey : '') +
        '/' +
        operationType +
        (name ? '/' + name : '')
    );
}

const storeTypeKey: keyof MiniRxAction<any> = 'storeType';

// Type predicate
export function isMiniRxAction<StateType>(
    action: Action,
    storeType: StoreType
): action is MiniRxAction<StateType> {
    return action[storeTypeKey] === storeType;
}

export const UNDO_ACTION = miniRxNameSpace + '/undo';

export function undo(action: Action) {
    return {
        type: UNDO_ACTION,
        payload: action,
    };
}
