import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import memoizeOne from 'memoize-one';

export interface AppState {
    [key: string]: string;
};

export interface Action {
    type: string;
    payload?: any;
}

export interface Feature<StateType> {
    state$: Observable<StateType>;
    setState: (stateFn: (state: StateType) => StateType) => void;
}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;

export function ofType<T extends Action>(
    type: string
): MonoTypeOperatorFunction<T> {
    return filter((action) => type === action.type);
}

export function createSelector(...args: any[]) {
    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];
    const memoizedProjector = memoizeOne(projector); // TODO add memoize function to src ?

    return (state) => {
        const selectorResults = selectors.map(fn => fn(state));
        return memoizedProjector.apply(null, selectorResults);
    };
}

export function createFeatureSelector<T>(
    featureName: string
) {
    return createSelector((state: AppState) => {
        const featureState = state[featureName];
        return featureState;
    }, (featureState: T) => featureState);
}
