import { createFeatureSelector, createSelector } from '../selector';
import { Action } from '../models';
import {
    counterInitialState,
    counterReducer,
    CounterState,
    counterStringInitialState,
    counterStringReducer,
    CounterStringState, createUniqueCounterReducerWithAction, resetStoreConfig,
    store,
} from './_spec-helpers';
import { undo, UndoExtension } from '../extensions/undo.extension';
import { FeatureStore } from '../feature-store';
import { Observable } from 'rxjs';
import StoreCore from '../store-core';

class MyFeatureStore extends FeatureStore<CounterStringState> {
    count$: Observable<string> = this.select((state) => state.counter);

    private lastAction: Action;

    constructor() {
        super('featureWithUndo', counterStringInitialState);
    }

    count(payload: string): Action {
        return this.lastAction = this.setState((state) => ({
            counter: state.counter + payload,
        }));
    }

    resetCount() {
        this.setState(counterStringInitialState);
    }

    undoLastAction() {
        this.undo(this.lastAction);
    }

    undoActions(actions: Action[]) {
        actions.forEach(item => this.undo(item))
    }
}

describe('Undo Extension', () => {
    describe('FeatureStore', () => {
        beforeEach(() => {
            resetStoreConfig();
            StoreCore.addExtension(new UndoExtension());
        });

        it('should throw if Undo Extension is not added', () => {
            const featureStore: MyFeatureStore = new MyFeatureStore();
            expect(featureStore.undoLastAction).toThrow();
        });

        it('should undo dispatched actions', () => {
            const featureStore: MyFeatureStore = new MyFeatureStore();
            const counterSpy = jest.fn();
            featureStore.count$.subscribe(counterSpy);
            featureStore.count('2');
            featureStore.undoLastAction();
            featureStore.count('3');
            featureStore.undoLastAction();
            featureStore.count('4');
            featureStore.count('5');
            featureStore.undoLastAction();
            featureStore.count('6');
            expect(counterSpy).toHaveBeenLastCalledWith('146');
            counterSpy.mockReset();

            featureStore.resetCount();
            const undoNum2 = featureStore.count('2');
            const actionsToUndo: Action[] = [featureStore.count('3'), featureStore.count('4'), featureStore.count('5')];
            featureStore.count('6');

            expect(counterSpy).toHaveBeenLastCalledWith('123456');
            counterSpy.mockReset();

            featureStore.undoActions(actionsToUndo);
            expect(counterSpy).toHaveBeenLastCalledWith('126');
            counterSpy.mockReset();

            featureStore.count('7');
            featureStore.undoActions([undoNum2]);
            expect(counterSpy).toHaveBeenLastCalledWith('167');
        });

        it('should not affect removed feature which is added again (for destroyable feature stores)', () => {
            const featureKey = 'destroyableCounter';
            const [reducer, action] = createUniqueCounterReducerWithAction();
            StoreCore.addFeature<CounterState>(featureKey, reducer);

            const spy = jest.fn();

            const getCount = createSelector(createFeatureSelector<CounterState>(featureKey), state => state?.counter);
            let lastAction: Action;

            store
                .select(getCount)
                .subscribe(spy);

            expect(spy).toHaveBeenCalledWith(1);

            store.dispatch(action);
            store.dispatch(action);
            store.dispatch(action);
            store.dispatch(action);
            lastAction = {...action};
            store.dispatch(lastAction);

            expect(spy).toHaveBeenCalledWith(6);
            spy.mockReset();

            store.dispatch(undo(lastAction));

            expect(spy).toHaveBeenCalledWith(5);
            spy.mockReset();

            StoreCore.removeFeature(featureKey);
            StoreCore.addFeature<CounterState>(featureKey, reducer);

            store.dispatch(action);
            lastAction = {...action};
            store.dispatch(lastAction);
            expect(spy).toHaveBeenCalledWith(3);
            spy.mockReset();

            store.dispatch(undo(lastAction));

            expect(spy).toHaveBeenCalledWith(2);
        });
    });

    describe('Store Feature', () => {
        beforeEach(() => {
            resetStoreConfig();
            StoreCore.addExtension(new UndoExtension());
        });

        it('should undo dispatched actions', () => {
            const featureKey = 'counterStringWithUndo';
            const getCounterFeatureState = createFeatureSelector<CounterStringState>(featureKey);
            const getCounter = createSelector(getCounterFeatureState, (state) => {
                return state.counter;
            });

            const counterSpy = jest.fn();

            store.feature<CounterStringState>(featureKey, counterStringReducer);
            store.select(getCounter).subscribe(counterSpy);

            function createCounterAction(payload: string) {
                return {
                    type: 'counterString',
                    payload,
                };
            }

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

        it('should not affect removed feature states / reducers', () => {
            StoreCore.addFeature<CounterState>('tempCounter1', counterReducer);
            StoreCore.addFeature<CounterState>('tempCounter2', counterReducer);

            const spy = jest.fn();

            store
                .select((state) => {
                    return state;
                })
                .subscribe(spy);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    tempCounter1: counterInitialState,
                    tempCounter2: counterInitialState,
                })
            );

            spy.mockReset();

            const counterAction: Action = { type: 'counter' };
            store.dispatch(counterAction);
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    tempCounter1: { counter: 2 },
                    tempCounter2: { counter: 2 },
                })
            );

            spy.mockReset();

            StoreCore.removeFeature('tempCounter2');
            store.dispatch(undo(counterAction));
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ tempCounter1: counterInitialState })
            );
            expect(spy).toHaveBeenCalledWith(
                expect.not.objectContaining({ tempCounter2: counterInitialState })
            );
        });
    });
});
