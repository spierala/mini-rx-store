import { Observable, OperatorFunction, filter } from 'rxjs';
import {
    Action,
    EFFECT_METADATA_KEY,
    HasEffectMetadata,
    MetaReducer,
    MiniRxAction,
    Reducer,
    StateOrCallback,
    StoreExtension,
    StoreType,
} from '../lib/models';
import { miniRxNameSpace } from '../lib/constants';
import { isMiniRxAction } from './is-mini-rx-action';

export function ofType(...allowedTypes: string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) =>
        allowedTypes.some((type) => {
            return type === action.type;
        })
    );
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
    return Object.hasOwn(param, EFFECT_METADATA_KEY);
}

// Only display type and payload in the LoggingExtension and Redux DevTools
export function beautifyActionForLogging(action: Action | MiniRxAction<any>): Action {
    if (
        isMiniRxAction(action, StoreType.FEATURE_STORE) ||
        isMiniRxAction(action, StoreType.COMPONENT_STORE)
    ) {
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

export function sortExtensions<T extends StoreExtension>(extensions: T[]): T[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}
