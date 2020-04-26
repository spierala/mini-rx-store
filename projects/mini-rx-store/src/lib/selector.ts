import memoizeOne from 'memoize-one';

// Credits for the Typing of createSelector go to NgRx!
// https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts
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
    projector: (
        s1: S1,
        s2: S2,
        s3: S3,
        s4: S4,
        s5: S5,
        s6: S6,
        s7: S7,
        s8: S8
    ) => Result
): Selector<State, Result>;


export function createSelector(...args: any[]): Selector<any, any> {
    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];
    const memoizedProjector = memoizeOne(projector);

    return memoizeOne((state) => {
        const selectorResults = selectors.map(fn => fn(state));
        return memoizedProjector.apply(null, selectorResults);
    });
}


export function createFeatureSelector<T>(
    featureName?: string
): Selector<object, T>;

export function createFeatureSelector(featureName?: string): Selector<any, any> {
    return createSelector((state: any) => {
        if (featureName) {
            return state[featureName];
        }
        return state;
    }, (featureState) => featureState);
}
