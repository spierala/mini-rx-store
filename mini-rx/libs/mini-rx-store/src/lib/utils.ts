import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  Action,
  MiniRxActionType,
  MetaReducer,
  Reducer,
  ActionWithPayload
} from './models';

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

export function omit<T extends Record<string, any>>(object: T, keyToOmit: keyof T): Record<string, any> {
    return Object.keys(object)
        .filter((key) => key !== keyToOmit)
        .reduce((prevValue, key) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {} as Record<string, any>);
}

export const miniRxNameSpace = '@mini-rx';

export function createMiniRxAction(miniRxActionType: MiniRxActionType, featureKey?: string, payload?: any): ActionWithPayload {
    return {type: miniRxNameSpace + '/' + miniRxActionType + (featureKey ? '/' + featureKey : ''), payload};
}

export function isMiniRxAction(action: Action, miniRxActionType: MiniRxActionType) {
    return action.type.indexOf(miniRxNameSpace + '/' + miniRxActionType) === 0;
}

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}
