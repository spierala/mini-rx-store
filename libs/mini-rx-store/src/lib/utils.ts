import { pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isComponentStoreSetStateAction, isFeatureStoreSetStateAction } from './actions';
import { miniRxNameSpace } from '@mini-rx/common';
import { Action, MetaReducer, Reducer, StateOrCallback } from '@mini-rx/common';

export function select<T, R>(mapFn: (state: T) => R) {
    return pipe(map(mapFn), distinctUntilChanged());
}

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}

export function miniRxConsoleError(message: string, err: any): void {
    console.error(miniRxNameSpace + ': ' + message + '\nDetails:', err);
}

// Only display type and payload in the LoggingExtension and Redux DevTools
export function beautifyActionForLogging(action: Action, state: object): Action {
    if (isFeatureStoreSetStateAction(action) || isComponentStoreSetStateAction(action)) {
        return {
            type: action.type,
            payload: action.stateOrCallback,
        };
    }
    return action;
}

export function calcNewState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
    const newPartialState =
        typeof stateOrCallback === 'function' ? stateOrCallback(state) : stateOrCallback;
    return {
        ...state,
        ...newPartialState,
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
