import { Action } from 'mini-rx-store';
import { StateOrCallback } from './models';
import { miniRxNameSpace } from './utils';

export type MiniRxActionType = 'init-store' | 'init-feature' | 'destroy-feature' | 'set-state';

export class SetStateAction<T> implements Action {
    __internalType: MiniRxActionType;
    type: string;

    constructor(
        public stateOrCallback: StateOrCallback<T>,
        public __internalFeatureId: string,
        public featureKey: string,
        name?: string
    ) {
        this.__internalType = 'set-state';
        this.type =
            createMiniRxActionType(this.__internalType, featureKey) + (name ? '/' + name : '');
    }
}

export function createMiniRxAction(
    miniRxActionType: MiniRxActionType,
    featureKey?: string
): Action {
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey),
    };
}

function createMiniRxActionType(miniRxActionType: MiniRxActionType, featureKey?: string) {
    return miniRxNameSpace + '/' + miniRxActionType + (featureKey ? '/' + featureKey : '');
}
