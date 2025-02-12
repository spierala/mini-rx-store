// Credits go to NgRx
// Copied from NgRx with small modifications:
// https://github.com/ngrx/platform/blob/9.2.0/modules/effects/src/effects_error_handler.ts

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

import { catchError, Observable } from 'rxjs';
import { miniRxConsoleError } from './mini-rx-console-error';

// Prevent effect to unsubscribe from the actions stream
export function defaultEffectsErrorHandler<T>(
    observable$: Observable<T>,
    retryAttemptsLeft = 10
): Observable<T> {
    return observable$.pipe(
        catchError((error) => {
            miniRxConsoleError(
                `An error occurred in the Effect. MiniRx resubscribed the Effect automatically and will do so ${
                    retryAttemptsLeft - 1
                } more times.\nPlease provide error handling inside the Effect using \`catchError\` or \`tapResponse\`.`,
                error
            );
            if (retryAttemptsLeft <= 1) {
                return observable$; // last attempt
            }
            // Return observable that produces this particular effect
            return defaultEffectsErrorHandler(observable$, retryAttemptsLeft - 1);
        })
    );
}
