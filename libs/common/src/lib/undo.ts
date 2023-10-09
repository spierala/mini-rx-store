import { miniRxNameSpace } from './constants';
import { Action } from './models';

export const UNDO_ACTION = miniRxNameSpace + '/undo';

export function undo(action: Action) {
    return {
        type: UNDO_ACTION,
        payload: action,
    };
}
