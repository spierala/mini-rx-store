import { counterInitialState, CounterState } from './_spec-helpers';
import Store from '../store';
import { ImmutableStateExtension } from '../immutable-state.extension';
import { Observable } from 'rxjs';
import { createFeatureSelector, createSelector } from '../selector';
import { Action } from '../interfaces';

export function counterReducerWithMutation(state: CounterState = counterInitialState, action: Action) {
    switch (action.type) {
        case 'counter':
            state.counter = state.counter + 1;

            console.log('mutated');

            return state;
        default:
            return state;
    }
}

describe('Immutable State Extension', () => {
    beforeAll(() => {
        Store.addExtension(new ImmutableStateExtension());
        Store.feature<CounterState>('immutableCounter', counterReducerWithMutation);
    });
    it('should mutate and throw error', () => {
        const spy = jest.fn();

        const featureSelector = createFeatureSelector<CounterState>('immutableCounter');
        const counterSelector = createSelector(featureSelector, state => state.counter);
        const counter$: Observable<number> = Store.select(counterSelector);

        counter$.subscribe(spy);

        Store.dispatch({type: 'counter'});

        expect(spy).toHaveBeenCalledWith(1);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
