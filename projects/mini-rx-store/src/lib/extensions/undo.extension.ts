// Credits go to https://github.com/brechtbilliet/ngrx-undo

import { Action, Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';

const defaultBufferSize = 100;

export let isUndoExtensionInitialized: boolean;
let executedActions: Array<Action> = [];
let initialState = {};
let bufferSize;

export class UndoExtension implements StoreExtension {
    constructor(_bufferSize: number = defaultBufferSize) {
        bufferSize = _bufferSize;
        isUndoExtensionInitialized = true;
    }

    init(): void {
        StoreCore.addMetaReducers(undoMetaReducer);
    }
}

const UNDO_ACTION = '@mini-rx/UNDO-ACTION';

export function undo(action: Action) {
    return {
        type: UNDO_ACTION,
        payload: action,
    };
}

function undoMetaReducer(rootReducer: Reducer<any>): Reducer<any> {
    return (state: any = {}, action: any) => {
        if (action.type === UNDO_ACTION) {
            // if the action is UNDO_ACTION,
            // then call all the actions again on the rootReducer,
            // except the one we want to rollback
            let newState: any = initialState;
            executedActions = executedActions.filter((eAct) => eAct !== action.payload);
            // update the state for every action untill we get the
            // exact same state as before, but without the action we want to rollback
            executedActions.forEach(
                (executedAction) => (newState = rootReducer(newState, executedAction))
            );
            return newState;
        } else if (action.type !== '@mini-rx/store/init') {
            // push every action that isn't an UNDO_ACTION to the executedActions property
            executedActions.push(action);
        }
        const updatedState = rootReducer(state, action);
        if (executedActions.length === bufferSize + 1) {
            const firstAction = executedActions[0];
            // calculate the state x (buffersize) actions ago
            initialState = rootReducer(initialState, firstAction);
            // keep the correct actions
            executedActions = executedActions.slice(1, bufferSize + 1);
        }
        return updatedState;
    };
}