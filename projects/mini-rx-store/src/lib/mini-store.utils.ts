import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import memoizeOne from './memoize-one/src/memoize-one';
import { Action, AppState } from './interfaces';

export function ofType<T extends Action>(
    type: string
): MonoTypeOperatorFunction<T> {
    return filter((action) => type === action.type);
}

export function createSelector(...args: any[]) {
    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];
    const memoizedProjector = memoizeOne(projector);

    return (state) => {
        const selectorResults = selectors.map(fn => fn(state));
        return memoizedProjector.apply(null, selectorResults);
    };
}

export function createFeatureSelector<T>(
    featureName?: string
) {
    return createSelector((state: AppState) => {
        if (featureName) {
            return state[featureName];
        }
        return state;
    }, (featureState: T) => featureState);
}
