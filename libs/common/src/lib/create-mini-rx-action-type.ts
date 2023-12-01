import { miniRxNameSpace } from './constants';

export const enum OperationType {
    INIT = 'init',
    DESTROY = 'destroy',
    SET_STATE = 'set-state',
    CONNECTION = 'connection',
}

export function createMiniRxActionType(
    operationType: OperationType,
    featureKey?: string,
    name?: string
): string {
    return `${miniRxNameSpace}${featureKey ? '/' + featureKey : ''}/${operationType}${
        name ? '/' + name : ''
    }`;
}
