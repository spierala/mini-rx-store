import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Action } from './models';

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
