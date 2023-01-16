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

import { memoizeOne } from './memoize-one';

export type Selector<T, V> = (state: T) => V;

export function createSelector<State, S1, Result>(
    s1: Selector<State, S1>,
    projector: (s1: S1) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    projector: (s1: S1, s2: S2) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    projector: (s1: S1, s2: S2, s3: S3) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
): Selector<State, Result>;

export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
): Selector<State, Result>;

export function createSelector(...args: any[]): Selector<any, any> {
    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];
    const memoizedProjector = memoizeOne(projector);

    return memoizeOne((state) => {
        const selectorResults = selectors.map((fn) => fn(state));
        return memoizedProjector.apply(null, selectorResults);
    });
}

/** @deprecated Use `createFeatureStateSelector` which is more in line with `createComponentStateSelector` */
export function createFeatureSelector<T>(featureKey?: string): Selector<object, T>;
/** @deprecated Use `createFeatureStateSelector` which is more in line with `createComponentStateSelector` */
export function createFeatureSelector<T, V>(featureKey: keyof T): Selector<T, V>;
/** @deprecated Use `createFeatureStateSelector` which is more in line with `createComponentStateSelector` */
export function createFeatureSelector(featureKey?: any): Selector<any, any> {
    if (featureKey) {
        return createSelector(
            (state: any) => state[featureKey],
            (featureState) => featureState
        );
    }
    return (state) => state; // Do not memoize: when used with FeatureStore there is a new state object created for every `setState`
}

export const createFeatureStateSelector = createFeatureSelector;
export function createComponentStateSelector<T>(): Selector<T, T> {
    return (state: T) => state;
}
