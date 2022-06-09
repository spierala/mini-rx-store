import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action, ActionWithPayload, AppState } from './models';
import { MiniRxActionType, SetStateAction } from './actions';

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

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}

// Simple alpha numeric ID: https://stackoverflow.com/a/12502559/453959
// This isn't a real GUID!
export function generateId() {
    return Math.random().toString(36).slice(2);
}

const key: keyof SetStateAction<any> = '__internalType';
const type: MiniRxActionType = 'set-state';

// Type predicate
export function isSetStateAction<T>(action: Action): action is SetStateAction<T> {
    return action[key] === type;
}

export function beautifyActionsForLogging(action: Action, state: AppState): Action {
    if (isSetStateAction(action)) {
        return mapSetStateActionToActionWithPayload(action, state);
    }
    return action;
}

function mapSetStateActionToActionWithPayload(
    action: SetStateAction<any>,
    state: AppState
): ActionWithPayload {
    const stateOrCallback = action.stateOrCallback;
    const featureState = state[action.featureKey];
    return {
        type: action.type,
        payload:
            typeof stateOrCallback === 'function' ? stateOrCallback(featureState) : stateOrCallback,
    };
}
