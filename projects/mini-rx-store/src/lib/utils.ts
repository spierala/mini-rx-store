import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, AppState, MetaReducer, Reducer } from './interfaces';

export function ofType(...allowedTypes: string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some((type) => {
            return type === action.type;
        })
    );
}

export function combineReducers<StateType>(
    reducers: Reducer<any>[]
): Reducer<StateType> {
    return (state: AppState = {}, action: Action): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}

export function combineReducerWithMetaReducers(
    reducer: Reducer<AppState>,
    metaReducers: MetaReducer<any>[]
): Reducer<any> {
    return metaReducers.reduceRight(
        (previousValue: Reducer<any>, currentValue: MetaReducer<any>) => {
            return currentValue(previousValue);
        },
        reducer
    );
}

// TODO rename to createFeatureActionTypePrefix
export function createActionTypePrefix(featureName): string {
    return '@mini-rx/' + featureName;
}

export const nameUpdateAction = 'SET-STATE';
