import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action, ActionName, AppState, MetaReducer, Reducer, ReducerDictionary } from './models';

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

export function combineReducers(reducers: ReducerDictionary): Reducer<AppState> {
    const reducerKeys = Object.keys(reducers);
    const reducerKeyLength = reducerKeys.length;

    return (state: AppState = {}, action: Action): AppState => {
        const stateKeysLength = Object.keys(state).length;

        let hasChanged = stateKeysLength !== reducerKeyLength;
        const nextState: AppState = {};

        for (let i = 0; i < reducerKeyLength; i++) {
            const key = reducerKeys[i];
            const reducer: any = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);

            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
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

const miniRxNameSpace = '@mini-rx';

export function createMiniRxActionType(featureName, actionName: ActionName): string {
    return miniRxNameSpace + '/' + featureName + '/' + actionName;
}

export function isMiniRxAction(actionType: string, actionName: ActionName, featureName?: string) {
    return actionType.indexOf(miniRxNameSpace + (featureName ? `/${featureName}/` : '')) > -1 &&
        actionType.indexOf(actionName) > -1;
}

export function miniRxError(message: string) {
    throw new Error(miniRxNameSpace + ' ' + message);
}

export const storeInitActionType = miniRxNameSpace + '/store/init';
