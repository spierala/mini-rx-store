import { createFeatureSelector, createSelector } from '../selector';
import { Action } from '../models';
import {
    counterInitialState,
    counterReducer,
    CounterState,
    counterStringInitialState,
    counterStringReducer,
    CounterStringState,
    resetStoreConfig,
    store,
} from './_spec-helpers';
import { UndoExtension } from '../extensions/undo.extension';
import { FeatureStore } from '../feature-store';
import { Observable } from 'rxjs';
import { undo } from '../actions';
import { addExtension, addFeature, removeFeature } from '../store-core';
import { createComponentStore } from '../component-store';

class MyFeatureStore extends FeatureStore<CounterStringState> {
    count$: Observable<string> = this.select((state) => state.counter);

    private lastAction: Action | undefined;

    constructor() {
        super('featureWithUndo', counterStringInitialState);
    }

    count(payload: string): Action {
        return (this.lastAction = this.setState((state) => ({
            counter: state.counter + payload,
        })));
    }

    resetCount() {
        this.setState(counterStringInitialState);
    }

    undoLastAction() {
        if (this.lastAction) {
            this.undo(this.lastAction);
        }
    }

    undoActions(actions: Action[]) {
        actions.forEach((item) => this.undo(item));
    }
}

describe('Undo Extension', () => {
    describe('FeatureStore', () => {
        beforeEach(() => {
            resetStoreConfig();
            addExtension(new UndoExtension());
        });

        it('should throw if Undo Extension is not added', () => {
            const featureStore: MyFeatureStore = new MyFeatureStore();
            expect(featureStore.undoLastAction).toThrow();
        });

        it('should undo dispatched (setState) actions', () => {
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
            const actionsToUndo: Action[] = [
                featureStore.count('3'),
                featureStore.count('4'),
                featureStore.count('5'),
            ];
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

            class Fs extends FeatureStore<CounterState> {
                constructor() {
                    super(featureKey, counterInitialState);
                }

                increment(): Action {
                    return this.setState({
                        counter: this.state.counter + 1,
                    });
                }
            }

            const fs = new Fs();
            const spy = jest.fn();
            const getCount = createSelector(
                createFeatureSelector<CounterState>(featureKey),
                (state) => state?.counter
            );

            let lastAction: Action;

            store.select(getCount).subscribe(spy);

            expect(spy).toHaveBeenCalledWith(1);

            fs.increment();
            fs.increment();
            fs.increment();
            fs.increment();
            lastAction = fs.increment();

            expect(spy).toHaveBeenCalledWith(6);
            spy.mockReset();

            fs.undo(lastAction);

            expect(spy).toHaveBeenCalledWith(5);

            fs.destroy();

            spy.mockReset();

            const fs2 = new Fs();
            fs2.increment();
            lastAction = fs2.increment();
            expect(spy).toHaveBeenCalledWith(3);
            spy.mockReset();

            fs2.undo(lastAction);

            expect(spy).toHaveBeenCalledWith(2);
        });
    });

    describe('ComponentStore', () => {
        it('should throw if Undo Extension is not added', () => {
            const cs = createComponentStore();
            expect(cs.undo).toThrow();
        });

        it('should undo dispatched (setState) actions', () => {
            const cs = createComponentStore(counterStringInitialState, {
                extensions: [new UndoExtension()],
            });

            const addNumberToCounterString = (v: string) =>
                cs.setState((state) => ({ counter: state.counter + v }));

            const subscribeCallback = jest.fn<void, [string]>();

            cs.select((state) => state.counter).subscribe(subscribeCallback);

            addNumberToCounterString('2');
            const actionToUndo = addNumberToCounterString('3');
            addNumberToCounterString('4');
            addNumberToCounterString('5');

            cs.undo(actionToUndo);

            expect(subscribeCallback.mock.calls).toEqual([
                ['1'],
                ['12'],
                ['123'],
                ['1234'],
                ['12345'],
                ['1245'], // '3' has been removed
            ]);
        });
    });

    describe('Store Feature', () => {
        beforeEach(() => {
            resetStoreConfig();
            addExtension(new UndoExtension());
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
            addFeature<CounterState>('tempCounter1', counterReducer);
            addFeature<CounterState>('tempCounter2', counterReducer);

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

            removeFeature('tempCounter2');
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
