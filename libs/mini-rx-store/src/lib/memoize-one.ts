// Credits go to Alexander Reardon
// Copied from with small modifications: https://github.com/alexreardon/memoize-one/tree/v6.0.0/src

// MIT License
//
// Copyright (c) 2019 Alexander Reardon
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

function isEqual(first: unknown, second: unknown): boolean {
    if (first === second) {
        return true;
    }

    // Special case for NaN (NaN !== NaN)
    if (Number.isNaN(first) && Number.isNaN(second)) {
        return true;
    }

    return false;
}

function areInputsEqual(newInputs: readonly unknown[], lastInputs: readonly unknown[]): boolean {
    // no checks needed if the inputs length has changed
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    // Using for loop for speed. It generally performs better than array.every
    // https://github.com/alexreardon/memoize-one/pull/59
    for (let i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

type MemoizedFn<TFunc extends (this: any, ...args: any[]) => any> = {
    (this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>): ReturnType<TFunc>;
};

// internal type
type Cache<TFunc extends (this: any, ...args: any[]) => any> = {
    lastThis: ThisParameterType<TFunc>;
    lastArgs: Parameters<TFunc>;
    lastResult: ReturnType<TFunc>;
};

export function memoizeOne<TFunc extends (this: any, ...newArgs: any[]) => any>(
    resultFn: TFunc
): MemoizedFn<TFunc> {
    let cache: Cache<TFunc> | null = null;

    // breaking cache when context (this) or arguments change
    function memoized(
        this: ThisParameterType<TFunc>,
        ...newArgs: Parameters<TFunc>
    ): ReturnType<TFunc> {
        if (cache && cache.lastThis === this && areInputsEqual(newArgs, cache.lastArgs)) {
            return cache.lastResult;
        }

        // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
        // Doing the lastResult assignment first so that if it throws
        // the cache will not be overwritten
        const lastResult = resultFn.apply(this, newArgs);
        cache = {
            lastResult,
            lastArgs: newArgs,
            lastThis: this,
        };

        return lastResult;
    }

    return memoized;
}
