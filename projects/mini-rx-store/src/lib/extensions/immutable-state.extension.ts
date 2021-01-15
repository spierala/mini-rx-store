// Credits go to: https://github.com/brandonroberts/ngrx-store-freeze

import { Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';
import deepFreeze from 'deep-freeze-strict';

export class ImmutableStateExtension implements StoreExtension {
    init(): void {
        StoreCore.addMetaReducers(storeFreeze);
    }
}

/**
 * Meta-reducer that prevents state from being mutated anywhere in the app.
 */

function storeFreeze(reducer: Reducer<any>): Reducer<any> {
    return function freeze(state, action): any {
        state = state || {};

        deepFreeze(state);

        // guard against trying to freeze null or undefined types
        if (action.payload) {
            deepFreeze(action.payload);
        }

        const nextState = reducer(state, action);

        deepFreeze(nextState);

        return nextState;
    };
}
