import { computed, Signal } from '@angular/core';
import { isSignalSelector, SignalSelector } from './signal-selector';

type StateSelector<T, R> = (state: T) => R;

export class SelectableSignalState<StateType extends object> {
    constructor(private state: Signal<StateType>) {}

    select(): Signal<StateType>;
    select<R>(mapFn: SignalSelector<StateType, R>): Signal<R>;
    select<R>(mapFn: StateSelector<StateType, R>): Signal<R>;
    select(mapFn?: any): Signal<any> {
        if (!mapFn) {
            return this.state;
        }

        if (isSignalSelector(mapFn)) {
            return mapFn(this.state);
        }

        return computed(() => {
            return mapFn(this.state());
        });
    }
}
