import { combineReducers } from '../../combine-reducers';
import { Reducer, ReducerDictionary } from '../../models';

export function commandCombineReducers<T>(reducers: ReducerDictionary<T>): Reducer<T>;
export function commandCombineReducers(reducers: ReducerDictionary<any>): Reducer<any> {
    console.log('commandCombineReducers invoked');

    // do nothing more than default function
    return combineReducers(reducers);
}
