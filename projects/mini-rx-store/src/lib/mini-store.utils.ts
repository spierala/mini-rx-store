import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import memoizeOne from './memoize-one/src/memoize-one';

export interface AppState {
    [key: string]: string;
}

export interface Action {
    type: string;
    payload?: any;
}

export interface MiniFeature<StateType> {
    state$: Observable<StateType>;
    setState: (stateFn: (state: StateType) => StateType) => void;
}

export interface Settings {
    enableLogging: boolean;
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
    const memoizedProjector = memoizeOne(projector);

    return (state) => {
        const selectorResults = selectors.map(fn => fn(state));
        return memoizedProjector.apply(null, selectorResults);
    };
}

export function createFeatureSelector<T>(
    featureName: string
) {
    return createSelector((state: AppState) => {
        return state[featureName];
    }, (featureState: T) => featureState);
}
