import { computed, Signal } from '@angular/core';
import { isSignalSelector, SignalSelector } from './signal-selector';
import { defaultSignalEquality } from './utils';

type StateSelector<T, R> = (state: T) => R;

export function createSelectableSignalState<StateType extends object>(state: Signal<StateType>) {
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

        return computed(
            () => {
                return mapFn(state());
            },
            { equal: defaultSignalEquality }
        );
    }

    return {
        select,
    };
}
