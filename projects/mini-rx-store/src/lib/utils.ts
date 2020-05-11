import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, Reducer } from './interfaces';

export function ofType(
    ...allowedTypes: string[]
): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some(type => {
            return type === action.type;
        })
    );
}

export function combineReducers<StateType, ActionType>(reducers: Reducer<StateType>[]): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}

export function createActionTypePrefix(featureName): string {
    return '@mini-rx/' + featureName;
}

export const nameUpdateAction = 'set-state';
