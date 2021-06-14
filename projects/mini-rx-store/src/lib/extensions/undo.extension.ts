// Credits go to https://github.com/brechtbilliet/ngrx-undo
// See MIT licence below

import { Action, ExtensionSortOrder, Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';
import { isMiniRxAction, storeInitActionType } from '../utils';

const defaultBufferSize = 100;

export let isUndoExtensionInitialized: boolean;
let executedActions: Array<Action> = [];
let initialState;
let bufferSize;

export class UndoExtension extends StoreExtension {
    sortOrder = ExtensionSortOrder.UNDO_EXTENSION;

    constructor(config: { bufferSize: number } = { bufferSize: defaultBufferSize }) {
        super();

        bufferSize = config.bufferSize;
    }

    init(): void {
        StoreCore.addMetaReducers(undoMetaReducer);
        isUndoExtensionInitialized = true;
    }
}

const UNDO_ACTION = '@mini-rx/undo';

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
            // update the state for every action until we get the
            // exact same state as before, but without the action we want to rollback
            executedActions.forEach(
                (executedAction) => (newState = rootReducer(newState, executedAction))
            );
            return newState;
        } else if (
            !(
                action.type === storeInitActionType ||
                isMiniRxAction(action.type, 'init') ||
                isMiniRxAction(action.type, 'destroy')
            )
        ) {
            // push every action that isn't UNDO_ACTION / storeInitAction / "MiniRx (feature) Init" / "MiniRx (feature) Destroy" to the executedActions property
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

// MIT License
//
// Copyright (c) 2016 Brecht Billiet
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
