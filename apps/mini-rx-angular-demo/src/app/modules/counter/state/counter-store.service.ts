import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureStore } from 'mini-rx-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStore extends FeatureStore<CounterState> {
    count$: Observable<number> = this.select((state) => state.count);

    constructor() {
        super('counter', initialState, { multi: true });
    }

    increment() {
        this.setState((state) => ({ count: state.count + 1 }), 'increment');
    }

    decrement() {
        this.setState((state) => ({ count: state.count - 1 }), 'decrement');
    }
}
