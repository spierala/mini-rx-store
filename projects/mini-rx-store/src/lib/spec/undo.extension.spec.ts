import { createFeatureSelector, createSelector } from '../selector';
import { Action } from '../models';
import {
    counterStringInitialState,
    counterStringReducer,
    CounterStringState,
    store,
} from './_spec-helpers';
import { undo, UndoExtension } from '../extensions/undo.extension';
import { FeatureStore } from '../feature-store';
import { Observable } from 'rxjs';

class MyFeatureStore extends FeatureStore<CounterStringState> {
    count$: Observable<string> = this.select((state) => state.counter);

    private lastAction: Action;

    constructor() {
        super('featureWithUndo', counterStringInitialState);
    }

    count(payload: string) {
        this.lastAction = this.setState((state) => ({
            counter: state.counter + payload,
        }));
    }

    undoLastAction() {
        this.undo(this.lastAction);
    }
}

describe('Undo Extension', () => {
    describe('FeatureStore', () => {
        const featureStore: MyFeatureStore = new MyFeatureStore();

        it('should throw it Undo Extension is not added', () => {
            expect(featureStore.undoLastAction).toThrow();
        });

        store._addExtension(new UndoExtension());

        const counterSpy = jest.fn();
        featureStore.count$.subscribe(counterSpy);

        it('should undo dispatched actions', () => {
            featureStore.count('2');
            featureStore.count('3');
            featureStore.undoLastAction();
            featureStore.count('4');
            featureStore.count('5');
            featureStore.undoLastAction();
            featureStore.count('6');
            expect(counterSpy).toHaveBeenLastCalledWith('1246');
        });
    });

    describe('CounterStringReducer', () => {
        const featureName = 'counterStringWithUndo';
        const getCounterFeatureState = createFeatureSelector<CounterStringState>(featureName);
        const getCounter = createSelector(getCounterFeatureState, (state) => {
            return state.counter;
        });

        const counterSpy = jest.fn();

        store.feature<CounterStringState>(featureName, counterStringReducer);
        store.select(getCounter).subscribe(counterSpy);

        function createCounterAction(payload: string) {
            return {
                type: 'counterString',
                payload,
            };
        }

        it('should undo dispatched actions', () => {
            store.dispatch(createCounterAction('2'));

            const createCounter3Action: Action = createCounterAction('3');
            store.dispatch(createCounter3Action);

            store.dispatch(createCounterAction('4'));
            store.dispatch(createCounterAction('5'));

            const createCounter6Action: Action = createCounterAction('6');
            store.dispatch(createCounter6Action);

            store.dispatch(createCounterAction('7'));
            store.dispatch(createCounterAction('8'));

            const createCounter9Action: Action = createCounterAction('9');
            store.dispatch(createCounter9Action);

            store.dispatch(createCounterAction('10'));

            expect(counterSpy).toHaveBeenLastCalledWith('12345678910');

            store.dispatch(undo(createCounter3Action));
            store.dispatch(undo(createCounter6Action));
            store.dispatch(undo(createCounter9Action));

            expect(counterSpy).toHaveBeenLastCalledWith('12457810');
        });
    });
});
