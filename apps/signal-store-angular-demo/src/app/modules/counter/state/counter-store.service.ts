import { createFeatureStore } from '@mini-rx/signal-store';

// interface CounterState {
//     count: number;
// }

const initialState = {
    count: 42,
};

// // BEFORE (OOP with extends)
// @Injectable()
// export class CounterStore1 extends FeatureStore<CounterState> {
//     count: Signal<number> = this.select((state) => state.count);
//
//     constructor() {
//         super('counter', initialState, { multi: true });
//     }
//
//     increment() {
//         this.setState((state) => ({ count: state.count + 1 }), 'increment');
//     }
//
//     decrement() {
//         this.setState((state) => ({ count: state.count - 1 }), 'decrement');
//     }
// }
//
//
// // BEFORE (OOP style with functional creation method)
// @Injectable()
// export class CounterStore2 {
//     private fs = createFeatureStore('counter', initialState, { multi: true });
//
//     count: Signal<number> = this.fs.select((state) => state.count);
//
//     increment() {
//         this.fs.setState(({ count }) => ({ count: count + 1 }), 'increment');
//     }
//
//     decrement() {
//         this.fs.setState(({ count }) => ({ count: count - 1 }), 'decrement');
//     }
// }

// AFTER (more functional)
export function createCounterStore() {
    const { setState, select } = createFeatureStore('counter', initialState, { multi: true });
    return {
        count: select((state) => state.count),
        increment: () => {
            setState(({ count }) => ({ count: count + 1 }), 'increment');
        },
        decrement() {
            setState(({ count }) => ({ count: count - 1 }), 'decrement');
        },
    };
}
