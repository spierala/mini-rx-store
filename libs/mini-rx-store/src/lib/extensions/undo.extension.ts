// Credits go to Brecht Billiet
// Copied from: https://github.com/brechtbilliet/ngrx-undo/blob/master/src/handleUndo.ts
// Code has been modified to work with MiniRx

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

import {
    Action,
    ExtensionId,
    ExtensionSortOrder,
    HasComponentStoreSupport,
    MetaReducer,
    Reducer,
    StoreExtension,
} from '../models';
import { UNDO_ACTION } from '../actions';

const defaultBufferSize = 100;

export class UndoExtension extends StoreExtension implements HasComponentStoreSupport {
    id = ExtensionId.UNDO;
    override sortOrder = ExtensionSortOrder.UNDO_EXTENSION;
    hasCsSupport = true as const;

    constructor(private config: { bufferSize: number } = { bufferSize: defaultBufferSize }) {
        super();
    }

    init(): MetaReducer<any> {
        return createUndoMetaReducer(this.config.bufferSize);
    }
}

function createUndoMetaReducer(bufferSize: number): MetaReducer<any> {
    let executedActions: Array<Action> = [];
    let initialState: any;

    return (rootReducer: Reducer<any>): Reducer<any> => {
        return (state: any, action: any) => {
            if (action.type === UNDO_ACTION) {
                // if the action is UNDO_ACTION,
                // then call all the actions again on the rootReducer,
                // except the one we want to rollback
                let newState: any = initialState;
                executedActions = executedActions.filter((eAct) => eAct !== action.payload);
                // update the state for every action until we get the
                // exact same state as before, but without the action we want to rollback
                executedActions.forEach((executedAction) => {
                    newState = rootReducer(newState, executedAction);
                });
                return newState;
            } else {
                // push every action that isn't UNDO_ACTION
                executedActions.push(action);
            }
            const updatedState = rootReducer(state, action);
            if (executedActions.length === bufferSize + 1) {
                const firstAction = executedActions[0];
                // calculate the state x (bufferSize) actions ago
                initialState = rootReducer(initialState, firstAction);
                // keep the correct actions
                executedActions = executedActions.slice(1, bufferSize + 1);
            }
            return updatedState;
        };
    };
}
