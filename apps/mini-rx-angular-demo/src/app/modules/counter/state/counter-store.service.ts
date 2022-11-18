import { Injectable } from '@angular/core';
import { Observable, pipe, timer } from 'rxjs';
import { ComponentStore } from 'mini-rx-store';
import { tap } from 'rxjs/operators';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

const timer$ = timer(0, 1000);

@Injectable()
export class CounterStore extends ComponentStore<CounterState> {
    count$: Observable<number> = this.select((state) => state.count);

    // Effect to test destroy
    // Should stop logging when component is destroyed
    fx = this.effect(pipe(tap(console.log)));

    constructor() {
        super();

        // Test lazy initialization
        setTimeout(() => {
            this.setInitialState(initialState);
        }, 5000);

        this.fx(timer$);
    }

    increment() {
        this.setState({ count: this.state.count + 1 }, 'increment');
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'decrement');
    }
}
