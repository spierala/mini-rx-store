import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, AppState, MetaReducer, Reducer } from './models';

export function ofType(...allowedTypes: string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some((type) => {
            return type === action.type;
        })
    );
}

export function combineReducers(reducers: Reducer<any>[]): Reducer<AppState> {
    return (state: AppState = {}, action: Action): AppState => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
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

export function createActionTypePrefix(featureName): string {
    return '@mini-rx/' + featureName;
}

export function miniRxError(message: string) {
    throw new Error(`MiniRx: ` + message);
}

export const storeInitActionType = '@mini-rx/store/init';
