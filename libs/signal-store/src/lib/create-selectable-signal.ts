import { computed, Signal, WritableSignal } from '@angular/core';
import { isSignalSelector, SignalSelector } from './signal-selector';

type StateSelector<T, R> = (state: T) => R;

function createSelectFn<StateType extends object>(state: Signal<StateType>) {
    function select(): Signal<StateType>;
    function select<R>(mapFn: SignalSelector<StateType, R>): Signal<R>;
    function select<R>(mapFn: StateSelector<StateType, R>): Signal<R>;
    function select(mapFn?: any): Signal<any> {
        if (!mapFn) {
            return state;
        }

        if (isSignalSelector(mapFn)) {
            return mapFn(state);
        }

        return computed(() => {
            return mapFn(state());
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
