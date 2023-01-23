import { counterInitialState, CounterState, store } from './_spec-helpers';
import { ImmutableStateExtension } from '../extensions/immutable-state.extension';
import { Action, MetaReducer, Reducer } from '../models';
import { createFeatureSelector } from '../selector';
import { createFeatureStore, FeatureStore } from '../feature-store';
import { addExtension } from '../store-core';
import { createComponentStore } from '../component-store';

// Return a fresh (shallow) copy
function getCounterInitialState() {
    return {
        ...counterInitialState,
    };
}

export function counterReducerWithMutation(
    state: CounterState = getCounterInitialState(),
    action: Action
) {
    switch (action.type) {
        case 'counterWithoutMutation':
            return {
                ...state,
                counter: state.counter + 1,
            };
        case 'counterWithMutation':
            state.counter = 123; // mutate
            return {
                ...state,
                counter: state.counter + 1,
            };
        default:
            return state;
    }
}

describe('Store Freeze Meta Reducer', () => {
    const storeFreeze: MetaReducer<any> = new ImmutableStateExtension().init(); // init returns the storeFreeze Meta Reducer
    const frozenReducer: Reducer<CounterState> = storeFreeze(counterReducerWithMutation);

    it('should not throw', () => {
        const newState: CounterState = frozenReducer(
            { counter: 1 },
            { type: 'counterWithoutMutation' }
        );
        expect(newState.counter).toBe(2);
    });

    it('should throw when mutating state', () => {
        expect(() => frozenReducer({ counter: 1 }, { type: 'counterWithMutation' })).toThrow();
    });
});

describe('Without Immutable State Extension', () => {
    const featureSelector = createFeatureSelector<CounterState>('immutableCounter');
    let counterStateRaw: CounterState;

    beforeAll(() => {
        store.feature<CounterState>('immutableCounter', counterReducerWithMutation);
        store.select(featureSelector).subscribe((state) => (counterStateRaw = state));
    });

    it('should NOT throw when mutating state outside the reducer', () => {
        expect(() => (counterStateRaw.counter = 123)).not.toThrow();
    });

    it('should NOT throw when mutating state in a reducer', () => {
        const spy = jest.fn();

        store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        store.dispatch({ type: 'counterWithMutation' });
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('Immutable State Extension', () => {
    const featureSelector = createFeatureSelector<CounterState>('immutableCounter2');
    let counterStateRaw: CounterState;

    const fs: FeatureStore<CounterState> = createFeatureStore(
        'fsImmutable',
        getCounterInitialState()
    );

    beforeAll(() => {
        addExtension(new ImmutableStateExtension());
        store.feature<CounterState>('immutableCounter2', counterReducerWithMutation);
        store.select(featureSelector).subscribe((state) => (counterStateRaw = state));
    });

    it('should throw when mutating state outside the reducer', () => {
        expect(() => (counterStateRaw.counter = 123)).toThrow();
    });

    it('should not throw', () => {
        const spy = jest.fn();

        store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        store.dispatch({ type: 'counterWithoutMutation' });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw when mutating state in a reducer', () => {
        const spy = jest.fn();

        store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        // Strangely the following expect does not throw
        // Why does Jest not detect the error (ERROR TypeError: Cannot assign to read only property 'xyz' of object '[object Object]')?
        // It throws in the Browser!
        // expect(() => store.dispatch({type: 'counterWithMutation'})).toThrow();

        // Work around: However when mutating the state it does not emit a new state (I believe because of the exception)
        store.dispatch({ type: 'counterWithMutation' });
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should throw when mutating state from a FeatureStore', () => {
        let selectedFeatureState: CounterState;

        fs.select().subscribe((state) => (selectedFeatureState = state));

        expect(() => (selectedFeatureState.counter = 123)).toThrow();
        expect(() => (fs.state.counter = 123)).toThrow();
    });

    it('should throw when mutating state inside a FeatureStore reducer', () => {
        const spy = jest.fn();

        fs.select().subscribe(spy);

        spy.mockReset();

        // Strangely the following expect does not throw
        // Why does Jest not detect the error (ERROR TypeError: Cannot assign to read only property 'xyz' of object '[object Object]')?
        // It throws in the Browser!
        // expect(() =>
        //     fs.setState((state) => {
        //         state.counter = 123;
        //         return state;
        //     })
        // ).toThrow();

        // Work around: However when mutating the state it does not emit a new state (I believe because of the exception)
        fs.setState((state) => {
            state.counter = 123;
            return state;
        });

        expect(spy).toHaveBeenCalledTimes(0);
    });
});

describe('Immutable State Extension and ComponentStore', () => {
    it('should throw when mutating state from a ComponentStore', () => {
        const cs = createComponentStore(getCounterInitialState(), {
            extensions: [new ImmutableStateExtension()],
        });

        let selectedComponentState: CounterState;

        cs.select().subscribe((state) => (selectedComponentState = state));

        expect(() => (selectedComponentState.counter = 123)).toThrow();
        expect(() => (cs.state.counter = 123)).toThrow();

        // Strangely the following expect does not throw
        // Why does Jest not detect the error (ERROR TypeError: Cannot assign to read only property 'xyz' of object '[object Object]')?
        // It throws in the Browser!
        // expect(() =>
        //     cs.setState((state) => {
        //         state.counter = 123;
        //         return state;
        //     })
        // ).toThrow();

        // Work around: However when mutating the state it does not emit a new state (I believe because of the exception)
        const spy = jest.fn();
        cs.select().subscribe(spy);
        spy.mockReset();

        cs.setState((state) => {
            state.counter = 123;
            return {
                counter: state.counter + 1,
            };
        });

        expect(spy).toHaveBeenCalledTimes(0);
    });
});
