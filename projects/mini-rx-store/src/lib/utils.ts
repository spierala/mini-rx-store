import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action, ActionName, MetaReducer, Reducer } from './models';

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

export function omit<T extends { [key: string]: any }>(object: T, keyToOmit: keyof T): Partial<T> {
    return Object.keys(object)
        .filter((key) => key !== keyToOmit)
        .reduce((prevValue, key) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {});
}

const miniRxNameSpace = '@mini-rx';

export function createMiniRxActionType(featureKey, actionName: ActionName): string {
    return miniRxNameSpace + '/' + featureKey + '/' + actionName;
}

export function isMiniRxAction(actionType: string, actionName: ActionName, featureKey?: string) {
    return (
        actionType.indexOf(miniRxNameSpace + (featureKey ? `/${featureKey}/` : '')) > -1 &&
        actionType.indexOf(actionName) > -1
    );
}

export function miniRxError(message: string) {
    throw new Error(miniRxNameSpace + ': ' + message);
}

export const storeInitActionType = miniRxNameSpace + '/init';
