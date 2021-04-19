import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action, AppState, MetaReducer, Reducer, ReducerDictionary, ReducerMap } from './models';

export function ofType(...allowedTypes: string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some((type) => {
            return type === action.type;
        })
    );
}

export function select<T, K>(mapFn: (state: T) => K) {
    return pipe(
        map((state: T) => mapFn(state)),
        distinctUntilChanged()
    );
}

export function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<AppState> {
    return (state: AppState = {}, action: Action): AppState => {
        const newFeatureState: any = reducer(state[featureName], action);
        if (newFeatureState !== state[featureName]) {
            // Only return a new AppState if the feature state changed
            return {
                ...state,
                [featureName]: newFeatureState,
            };
        }
        return state;
    };
}

export function combineReducers(reducers: ReducerMap): Reducer<AppState> {
    return (state: AppState = {}, action: Action): AppState => {
        const keyToDelete = Object.keys(state).find(key => !reducers.has(key));

        const newState = Array.from(reducers).reduce((currState: AppState, [, reducer]) => {
            return reducer(currState, action);
        }, state);

        if (keyToDelete) {
            return omit(newState, keyToDelete);
        }
        return newState;
    };
}

export function combineMetaReducers<T>(metaReducers: MetaReducer<T>[]): MetaReducer<T> {
    return (reducer: Reducer<any>): Reducer<T> => {
        return metaReducers.reduceRight(
            (previousValue: Reducer<T>, currentValue: MetaReducer<T>) => {
                return currentValue(previousValue);
            },
            reducer
        );
    };
}

export function omit<T extends { [key: string]: any }>(
    object: T,
    keyToOmit: keyof T
): Partial<T> {
    return Object.keys(object).filter(key =>
        key !== keyToOmit).reduce((prevValue, key) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {}
    );
}

export function createActionTypePrefix(featureName): string {
    return '@mini-rx/' + featureName;
}

export function miniRxError(message: string) {
    throw new Error(`MiniRx: ` + message);
}

export const storeInitActionType = '@mini-rx/store/init';
