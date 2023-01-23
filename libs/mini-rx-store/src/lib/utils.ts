import { Observable, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
    Action,
    AppState,
    EFFECT_METADATA_KEY,
    HasEffectMetadata,
    MetaReducer,
    Reducer,
    StateOrCallback,
    StoreExtension,
} from './models';
import { isComponentStoreSetStateAction, isFeatureStoreSetStateAction } from './actions';
import { miniRxNameSpace } from './constants';

export function ofType(...allowedTypes: string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some((type) => {
            return type === action.type;
        })
    );
}
export function select<T, R>(mapFn: (state: T) => R) {
    return pipe(map(mapFn), distinctUntilChanged());
}

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}

export function miniRxConsoleError(message: string, err: any): void {
    console.error(miniRxNameSpace + ': ' + message + '\nDetails:', err);
}

export function hasEffectMetaData(
    param: Observable<Action>
): param is Observable<Action> & HasEffectMetadata {
    // eslint-disable-next-line no-prototype-builtins
    return param.hasOwnProperty(EFFECT_METADATA_KEY);
}

// Calculate the setState callback and remove internal properties (only display type and payload in the LoggingExtension and Redux DevTools)
export function beautifyActionForLogging(action: Action, state: object): Action {
    if (isFeatureStoreSetStateAction(action)) {
        const featureState = (state as AppState)[action.featureKey];
        return {
            type: action.type,
            payload: calcNewPartialState(featureState, action.stateOrCallback),
        };
    } else if (isComponentStoreSetStateAction(action)) {
        return {
            type: action.type,
            payload: calcNewPartialState(state, action.stateOrCallback),
        };
    }
    return action;
}

function calcNewPartialState<T>(state: T, stateOrCallback: StateOrCallback<T>): Partial<T> {
    return typeof stateOrCallback === 'function' ? stateOrCallback(state) : stateOrCallback;
}

export function calcNewState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
    const newPartialState = calcNewPartialState(state, stateOrCallback);
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

export function sortExtensions<T extends StoreExtension>(extensions: T[]): T[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}
