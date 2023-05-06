// Credits go to Brandon Roberts
// Copied from with small modifications: https://github.com/brandonroberts/ngrx-store-freeze/blob/v0.2.4/src/index.ts

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

import {
    Action,
    ExtensionId,
    HasComponentStoreSupport,
    MetaReducer,
    Reducer,
    StoreExtension,
} from '../models';
import { deepFreeze } from '../deep-freeze';

export class ImmutableStateExtension extends StoreExtension implements HasComponentStoreSupport {
    id = ExtensionId.IMMUTABLE_STATE;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return storeFreeze;
    }
}

function storeFreeze(reducer: Reducer<any>): Reducer<any> {
    return (state, action: Action) => {
        if (state) {
            deepFreeze(state);
        }
        const nextState = reducer(state, action);
        deepFreeze(nextState);
        return nextState;
    };
}
