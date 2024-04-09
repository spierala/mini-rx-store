import { miniRxNameSpace } from '@mini-rx/common';
import { OperationType } from './models';

export function createMiniRxActionType(
    operationType: OperationType,
    featureKey?: string,
    name?: string
): string {
    return `${miniRxNameSpace}${featureKey ? '/' + featureKey : ''}/${operationType}${
        name ? '/' + name : ''
    }`;
}
