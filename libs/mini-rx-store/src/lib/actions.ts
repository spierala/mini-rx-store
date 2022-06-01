import { Action } from 'mini-rx-store';
import { StateOrCallback } from './models';
import { miniRxNameSpace } from './utils';

export type MiniRxActionType =
    | 'init-store'
    | 'init-feature'
    | 'destroy-feature'
    | 'set-state'
    | 'noop';

export class SetStateAction<T> implements Action {
    __internalType: MiniRxActionType;
    type: string;

    constructor(
        public stateOrCallback: StateOrCallback<T>,
        public __internalFeatureId: number,
        featureKey: string,
        name?: string
    ) {
        this.__internalType = 'set-state';
        this.type =
            createMiniRxActionType(this.__internalType, featureKey) + (name ? '/' + name : '');
    }
}

export class MiniRxAction implements Action {
    type: string;

    constructor(miniRxActionType: MiniRxActionType, featureKey?: string) {
        this.type = createMiniRxActionType(miniRxActionType, featureKey);
    }
}

function createMiniRxActionType(miniRxActionType: MiniRxActionType, featureKey?: string) {
    return miniRxNameSpace + '/' + miniRxActionType + (featureKey ? '/' + featureKey : '');
}
