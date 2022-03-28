import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureStore } from 'mini-rx-store';

let id = 1;

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStateService extends FeatureStore<CounterState> {
    $count: Observable<number> = this.select((state) => state.count);

    constructor() {
        super('counter-' + id++, initialState);
    }

    increment() {
        this.setState({ count: this.state.count + 1 }, 'increment');
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'decrement');
    }
}
