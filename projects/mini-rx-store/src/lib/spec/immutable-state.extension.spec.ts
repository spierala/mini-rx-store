import { counterInitialState, CounterState } from './_spec-helpers';
import { ImmutableStateExtension, storeFreeze } from '../immutable-state.extension';
import { Action, Reducer } from '../interfaces';
import Store from '../store';
import { createFeatureSelector } from '../selector';

export function counterReducerWithMutation(
    state: CounterState = counterInitialState,
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
        Store.feature<CounterState>('immutableCounter', counterReducerWithMutation);
        Store.select(featureSelector).subscribe((state) => (counterStateRaw = state));
    });

    it('should NOT throw when mutating state outside the reducer', () => {
        expect(() => (counterStateRaw.counter = 123)).not.toThrow();
    });

    it('should NOT throw when mutating state in a reducer', () => {
        const spy = jest.fn();

        Store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        Store.dispatch({ type: 'counterWithMutation' });
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('Immutable State Extension', () => {
    const featureSelector = createFeatureSelector<CounterState>('immutableCounter2');
    let counterStateRaw: CounterState;

    beforeAll(() => {
        Store.addExtension(new ImmutableStateExtension());
        Store.feature<CounterState>('immutableCounter2', counterReducerWithMutation);
        Store.select(featureSelector).subscribe((state) => (counterStateRaw = state));
    });

    it('should throw when mutating state outside the reducer', () => {
        expect(() => (counterStateRaw.counter = 123)).toThrow();
    });

    it('should not throw', () => {
        const spy = jest.fn();

        Store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        Store.dispatch({ type: 'counterWithoutMutation' });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw when mutating state in a reducer', () => {
        const spy = jest.fn();

        Store.select(featureSelector).subscribe(spy);

        spy.mockReset();

        // Strangely the following expect does not throw
        // Why does Jest not detect the error (ERROR TypeError: Cannot assign to read only property 'xyz' of object '[object Object]')?
        // expect(() => Store.dispatch({type: 'counterWithMutation'})).toThrow();

        // However when mutating the state it does not emit a new state
        Store.dispatch({ type: 'counterWithMutation' });
        expect(spy).toHaveBeenCalledTimes(0);
    });
});
