import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureStore, InstantiationMode } from 'mini-rx-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStateService extends FeatureStore<CounterState> {
    count$: Observable<number> = this.select((state) => state.count);

    constructor() {
        super('counter', initialState, {
            instantiation: InstantiationMode.MULTIPLE_DETACHED,
        });
    }

    increment() {
        this.setState({ count: this.state.count + 1 }, 'add');
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'sub');
    }
}
