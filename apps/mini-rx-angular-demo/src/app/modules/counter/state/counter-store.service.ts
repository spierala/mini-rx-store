import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import {
    ComponentStore,
    ImmutableStateExtension,
    LoggerExtension,
    UndoExtension,
} from 'mini-rx-store';
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
    count$: Observable<number> = this.select((state) => state.count).pipe(
        tap((v) => console.log('EMIT count$', v))
    );

    // Effect to test destroy
    // Should stop logging when component is destroyed
    // fx = this.effect(pipe(tap(console.log)));

    constructor() {
        super(undefined, {
            extensions: [new UndoExtension()],
        });

        // Test lazy initialization
        setTimeout(() => {
            this.setInitialState(initialState);
        }, 5000);

        // setTimeout(() => {
        //     this.setState((state) => {
        //         state.count = 5; // Check if immutable extension is working
        //         return state;
        //     });
        // }, 6000);

        // this.fx(timer$);
    }

    increment() {
        const action = this.setState({ count: this.state.count + 1 }, 'increment');
        setTimeout(() => {
            this.undo(action);
        }, 3000);
    }

    decrement() {
        this.setState({ count: this.state.count - 1 }, 'decrement');
    }
}
