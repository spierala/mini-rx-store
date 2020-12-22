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

// TODO typing
export function combineReducers<StateType, ActionType>(
    reducers: Reducer<StateType>[]
): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}

// TODO typing
export function combineMetaReducers(metaReducers: MetaReducer<AppState>[]): MetaReducer<AppState> {
    return (reducer: Reducer<AppState>) => {
        return metaReducers.reduceRight(
            (previousValue: Reducer<AppState>, currentValue: MetaReducer<AppState>) => {
                return currentValue(previousValue);
            },
            reducer
        );
    };
}

export function createActionTypePrefix(featureName): string {
    return '@mini-rx/' + featureName;
}

export const nameUpdateAction = 'SET-STATE';
