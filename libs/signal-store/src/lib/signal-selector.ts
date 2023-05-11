// Credits go to NgRx
// Typings are taken directly from NgRx with small modifications:
// https://github.com/ngrx/platform/blob/8.6.0/modules/store/src/selector.ts

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

import { computed, Signal } from '@angular/core';
import { AppState } from './models';

export const SIGNAL_SELECTOR_KEY = '@mini-rx/signalSelector';

export interface HasSignalSelectorKey {
    [SIGNAL_SELECTOR_KEY]: true;
}

type Selector<T, R> = (state: Signal<T>) => Signal<R>;
export type SignalSelector<T, R> = Selector<T, R> & HasSignalSelectorKey;

export function createSelector<State, S1, Result>(
    s1: SignalSelector<State, S1>,
    projector: (s1: S1) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    projector: (s1: S1, s2: S2) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    projector: (s1: S1, s2: S2, s3: S3) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    s4: SignalSelector<State, S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    s4: SignalSelector<State, S4>,
    s5: SignalSelector<State, S5>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    s4: SignalSelector<State, S4>,
    s5: SignalSelector<State, S5>,
    s6: SignalSelector<State, S6>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    s4: SignalSelector<State, S4>,
    s5: SignalSelector<State, S5>,
    s6: SignalSelector<State, S6>,
    s7: SignalSelector<State, S7>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
): SignalSelector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    s1: SignalSelector<State, S1>,
    s2: SignalSelector<State, S2>,
    s3: SignalSelector<State, S3>,
    s4: SignalSelector<State, S4>,
    s5: SignalSelector<State, S5>,
    s6: SignalSelector<State, S6>,
    s7: SignalSelector<State, S7>,
    s8: SignalSelector<State, S8>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
): SignalSelector<State, Result>;

export function createSelector(...args: any[]): SignalSelector<any, any> {
    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];

    const selector: Selector<any, any> = (state) => {
        const signalsFromSelectors: Signal<any>[] = selectors.map((fn) => {
            return fn(state); // Pass the state Signal
        });

        // Return computed Signal which recalculates when one of the `signalsFromSelectors` notifies about changes
        return computed(
            () => {
                const results: any[] = signalsFromSelectors.map((aSignal) => aSignal());
                return projector(...results);
            },
            { equal: signalEquality } // Notify about changes only if there is a new primitive / object reference
        );
    };

    return addSignalSelectorKey(selector);
}

export function createFeatureStateSelector<T>(featureKey?: string): SignalSelector<object, T>;
export function createFeatureStateSelector<T, V>(featureKey: keyof T): SignalSelector<T, V>;
export function createFeatureStateSelector(featureKey?: any): SignalSelector<any, any> {
    let selector: Selector<any, any>;
    if (featureKey) {
        selector = createSelector(
            addSignalSelectorKey((state: Signal<any>) => state),
            (state: AppState) => state[featureKey]
        );
    } else {
        selector = (state) => state; // Do not memoize: when used with FeatureStore there is a new state object created for every `setState`
    }
    return addSignalSelectorKey(selector);
}

// Exported for testing
export function addSignalSelectorKey<T, R>(s: Selector<T, R>): SignalSelector<T, R> {
    Object.defineProperty(s, SIGNAL_SELECTOR_KEY, {
        value: true,
    });

    return s as SignalSelector<T, R>;
}

export function isSignalSelector(v: any): v is SignalSelector<any, any> {
    // eslint-disable-next-line no-prototype-builtins
    return v.hasOwnProperty(SIGNAL_SELECTOR_KEY);
}

function signalEquality(a: any, b: any) {
    return a === b;
}
