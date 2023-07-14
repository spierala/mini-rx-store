import { Injectable, Signal } from '@angular/core';
import { FeatureStore } from '@mini-rx/signal-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStore extends FeatureStore<CounterState> {
    count: Signal<number> = this.select((state) => state.count);

    constructor() {
        super('counter', initialState, { multi: true });
    }

    increment() {
        this.update((state) => ({ count: state.count + 1 }), 'increment');
    }

    decrement() {
        this.update((state) => ({ count: state.count - 1 }), 'decrement');
    }
}
