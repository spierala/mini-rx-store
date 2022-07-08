// Credits go to NgRx
// Copied from with small modifications: https://github.com/ngrx/platform/blob/13.2.0/modules/component-store/src/tap-response.ts

// The MIT License (MIT)
//
// Copyright (c) 2017 Brandon Roberts, Mike Ryan, Victor Savkin, Rob Wormald
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

import { EMPTY, identity, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { miniRxConsoleError } from './utils';

type TapResponseObj<T> = {
    next?: (next: T) => void;
    error: (error: any) => void;
    finalize?: () => void;
};

export function tapResponse<T>(obj?: TapResponseObj<T>): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(
    next: (next: T) => void,
    error: (error: any) => void,
    finalize?: () => void
): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(fn1OrObject: any, fn2?: any, fn3?: any): any {
    return (source: Observable<T>) => {
        const tapResponseObj: TapResponseObj<T> =
            typeof fn1OrObject === 'function'
                ? {
                      next: fn1OrObject,
                      error: fn2,
                      finalize: fn3,
                  }
                : fn1OrObject;

        return source.pipe(
            tap({
                next: (v) => {
                    if (tapResponseObj.next) {
                        tryCatch(() => tapResponseObj.next!(v), 'next');
                    }
                },
                error: (err) => tryCatch(() => tapResponseObj.error!(err), 'error'),
            }),
            catchError(() => EMPTY),
            tapResponseObj.finalize
                ? finalize(() => {
                      tryCatch(() => tapResponseObj.finalize!(), 'finalize');
                  })
                : identity // Conditionally apply operator: https://rxjs.dev/api/index/function/identity
        );
    };
}

function tryCatch(fn: () => void, whichCallback: 'next' | 'error' | 'finalize') {
    try {
        fn();
    } catch (error) {
        miniRxConsoleError(
            `An error occurred in the \`tapResponse\` ${whichCallback} callback.`,
            error
        );
    }
}
