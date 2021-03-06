// Credits go to: https://github.com/brandonroberts/ngrx-store-freeze
// See MIT licence below

import { ActionWithPayload, Reducer, StoreExtension } from '../models';
import StoreCore from '../store-core';
import deepFreeze from 'deep-freeze-strict';

export class ImmutableStateExtension extends StoreExtension {
    init(): void {
        StoreCore.addMetaReducers(storeFreeze);
    }
}

/**
 * Meta-reducer that prevents state from being mutated anywhere in the app.
 */
export function storeFreeze(reducer: Reducer<any>): Reducer<any> {
    return function freeze(state, action: ActionWithPayload): any {
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

// The MIT License (MIT)
//
// Copyright (c) 2017 Brandon Roberts
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
