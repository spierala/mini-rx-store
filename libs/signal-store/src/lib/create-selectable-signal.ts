import { computed, Signal, WritableSignal } from '@angular/core';
import { isSignalSelector, SignalSelector } from './signal-selector';
import { isKey } from '@mini-rx/common';

type StateSelector<T, R> = (state: T) => R;

function createSelectFn<StateType extends object>(state: Signal<StateType>) {
    function select(): Signal<StateType>;
    function select<R>(mapFn: SignalSelector<StateType, R>): Signal<R>;
    function select<R>(mapFn: StateSelector<StateType, R>): Signal<R>;
    function select<KeyType extends keyof StateType>(key: KeyType): Signal<StateType[KeyType]>;
    function select(mapFnOrKey?: any): Signal<any> {
        if (!mapFnOrKey) {
            return state;
        }

        if (isSignalSelector(mapFnOrKey)) {
            return mapFnOrKey(state);
        }

        return computed(() => {
            const rawState = state();
            return isKey(rawState, mapFnOrKey) ? rawState[mapFnOrKey] : mapFnOrKey(state());
        });
    }

    return select;
}

export function createSelectableSignal<StateType extends object>(state: Signal<StateType>) {
    return {
        select: createSelectFn(state),
        get: () => {
            return state();
        },
    };
}

export function createSelectableWritableSignal<StateType extends object>(
    state: WritableSignal<StateType>
) {
    return {
        select: createSelectFn(state),
        get: (): StateType => {
            return state();
        },
        set: (v: StateType): void => {
            state.set(v);
        },
    };
}
