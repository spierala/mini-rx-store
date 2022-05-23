import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action, ActionWithPayload } from './models';

export const miniRxNameSpace = '@mini-rx';

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

type MiniRxActionType = 'init-store' | 'init-feature' | 'destroy-feature' | 'set-state';

export function createMiniRxAction(
    miniRxActionType: MiniRxActionType,
    featureKey?: string,
    payload?: any
): ActionWithPayload {
    return {
        type: miniRxNameSpace + '/' + miniRxActionType + (featureKey ? '/' + featureKey : ''),
        payload,
    };
}

export function isMiniRxAction(
    action: Action,
    miniRxActionType: MiniRxActionType
): action is ActionWithPayload {
    // Return type is a type predicate! (https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
    return action.type.indexOf(miniRxNameSpace + '/' + miniRxActionType) === 0;
}

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}
