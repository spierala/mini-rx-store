import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, Reducer } from './interfaces';

export function ofType<T extends Action>(
    type: string
): MonoTypeOperatorFunction<T> {
    return filter((action) => type === action.type);
}

export function combineReducers<StateType, ActionType>(reducers: Reducer<StateType>[]): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}
