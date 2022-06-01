import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureStore, InstantiationMode } from 'mini-rx-store';

export class ComponentStore<T extends object> extends FeatureStore<T> {
    constructor(initialState: T) {
        super('', initialState, { instantiation: InstantiationMode.MULTIPLE_DETACHED });
    }
}

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

@Injectable()
export class CounterStateService extends ComponentStore<CounterState> {
    count$: Observable<number> = this.select((state) => state.count);

    constructor() {
        super(initialState);
    }

    increment() {
        this.setState({ count: this.state.count + 1 }, 'add');
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'sub');
    }
}
