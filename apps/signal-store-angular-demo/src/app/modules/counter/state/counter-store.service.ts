import { Injectable, Signal } from '@angular/core';
import { createFeatureStore } from '@mini-rx/signal-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStore {
    private fs = createFeatureStore('counter', initialState, { multi: true });

    count: Signal<number> = this.fs.select((state) => state.count);

    increment() {
        this.fs.setState(({ count }) => ({ count: count + 1 }), 'increment');
    }

    decrement() {
        this.fs.setState(({ count }) => ({ count: count - 1 }), 'decrement');
    }
}
