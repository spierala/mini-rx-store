import { ComponentStore, createComponentStore, globalCsConfig } from '../component-store';
import { counterInitialState, CounterState, userState } from './_spec-helpers';
import { Observable, of, pipe, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createComponentStateSelector, createSelector } from '../signal-selector';
import { ComponentStoreConfig } from '@mini-rx/common';
import { TestBed } from '@angular/core/testing';
import { Component, Injectable, signal } from '@angular/core';

function setup<T extends object>(
    initialState: T,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return TestBed.runInInjectionContext(() => {
        return createComponentStore(initialState, config);
    });
}

describe('ComponentStore', () => {
    it('should initialize the store', () => {
        const cs = setup(counterInitialState);

        const selectedState = cs.select();
        expect(selectedState()).toBe(counterInitialState);
    });

    it('should update state', () => {
        const cs = setup(counterInitialState);

        const selectedState = cs.select();
        expect(selectedState()).toBe(counterInitialState);

        cs.setState((state) => ({ counter: state.counter + 1 }));
        expect(selectedState()).toEqual({ counter: 2 });
    });

    it('should update state partially', () => {
        const cs = setup(userState);

        const selectedState = cs.select();
        expect(selectedState()).toBe(userState);

        cs.setState(() => ({ firstName: 'Nicolas' }));
        expect(selectedState()).toEqual({ ...userState, firstName: 'Nicolas' });
    });

    it('should connect state with an Observable', () => {
        const cs = setup(counterInitialState);

        const counterState$: Observable<number> = of(2, 3, 4, 5);

        const selectedState = cs.select((state) => state.counter);

        expect(selectedState()).toBe(1);

        // setState with Observable
        cs.connect({ counter: counterState$ });

        expect(selectedState()).toBe(5);

        // "normal" setState
        cs.setState((state) => ({ counter: state.counter + 1 }));
        expect(selectedState()).toBe(6);

        cs.setState((state) => ({ counter: state.counter + 1 }));
        expect(selectedState()).toBe(7);
    });

    it('should update state using a Signal', () => {
        @Injectable({ providedIn: 'root' })
        class MyComponentStore extends ComponentStore<CounterState> {
            constructor() {
                super(counterInitialState);
            }
        }

        @Component({
            selector: 'mini-rx-my-comp',
            template: `
                <span>{{ selectedCounterState() }}</span>
            `,
        })
        class WelcomeComponent {
            counterSignal = signal(2);

            selectedCounterState = this.myCs.select((state) => state.counter);

            constructor(public myCs: MyComponentStore) {}

            startUpdatingStateWithSignal() {
                this.myCs.connect({ counter: this.counterSignal });
            }
        }

        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(WelcomeComponent);
        const component = fixture.componentInstance;
        expect(component).toBeDefined();

        const compElement: HTMLElement = fixture.nativeElement;
        fixture.detectChanges();
        expect(compElement.textContent).toContain('1');

        component.startUpdatingStateWithSignal();
        fixture.detectChanges();
        expect(compElement.textContent).toContain('2');

        component.counterSignal.set(3);
        fixture.detectChanges();
        expect(compElement.textContent).toContain('3');
    });

    it('should select state with memoized selectors', () => {
        const getCounterSpy = jest.fn<void, [number]>();
        const getSquareCounterSpy = jest.fn<void, [number]>();

        const cs = setup(counterInitialState);

        const getComponentState = createComponentStateSelector<CounterState>();
        const getCounter = createSelector(getComponentState, (state) => {
            getCounterSpy(state.counter);
            return state.counter;
        });
        const getSquareCounter = createSelector(getCounter, (counter) => {
            getSquareCounterSpy(counter);
            return counter * 2;
        });

        const selectedState = cs.select(getSquareCounter);
        selectedState();
        cs.setState({ counter: 2 });
        selectedState();
        cs.setState({ counter: 2 });
        selectedState();
        cs.setState({ counter: 3 });
        selectedState();
        cs.setState({ counter: 3 });
        selectedState();
        cs.setState({ counter: 4 });
        selectedState();

        expect(getCounterSpy.mock.calls).toEqual([[1], [2], [2], [3], [3], [4]]); // No memoization: because a new state object is created for every call of `update`
        expect(getSquareCounterSpy.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it('should dispatch an Action when updating state', () => {
        const cs = setup(counterInitialState);

        const spy = jest.fn();
        cs['actionsOnQueue'].actions$.subscribe(spy);

        const setStateCallback = (state: CounterState) => ({ counter: state.counter + 1 });
        cs.setState(setStateCallback);
        expect(spy).toHaveBeenCalledWith({
            type: '@mini-rx/component-store/set-state',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        // With setState name
        cs.setState(setStateCallback, 'increment');
        expect(spy).toHaveBeenCalledWith({
            type: '@mini-rx/component-store/set-state/increment',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        // With setState name (when passing an Observable to setState)
        cs.connect({ counter: of(1, 2) });
        expect(spy.mock.calls).toEqual([
            [
                {
                    type: '@mini-rx/component-store/connection/counter',
                    stateOrCallback: {
                        counter: 1,
                    },
                },
            ],
            [
                {
                    type: '@mini-rx/component-store/connection/counter',
                    stateOrCallback: {
                        counter: 2,
                    },
                },
            ],
        ]);
    });

    it('should dispatch an Action on destroy', () => {
        // With initial state
        const cs = setup(counterInitialState);

        const spy = jest.fn();
        cs['actionsOnQueue'].actions$.subscribe(spy);

        cs['destroy']();

        expect(spy.mock.calls).toEqual([
            [
                {
                    type: '@mini-rx/component-store/destroy',
                },
            ],
        ]);
    });

    it('should unsubscribe from setState Observable on destroy', () => {
        @Component({
            selector: 'mini-rx-my-comp',
            template: ``,
        })
        class WelcomeComponent {
            private cs = createComponentStore(counterInitialState);
            private counterSource = new Subject<number>();
            selectedState = this.cs.select((state) => state.counter);

            useObservableToUpdateState() {
                this.cs.connect({ counter: this.counterSource });
            }

            updateObservableValue(v: number) {
                this.counterSource.next(v);
            }
        }

        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(WelcomeComponent);
        const component = fixture.componentInstance;
        expect(component).toBeDefined();

        component.useObservableToUpdateState();

        expect(component.selectedState()).toBe(1);

        component.updateObservableValue(1);
        expect(component.selectedState()).toBe(1);
        component.updateObservableValue(2);
        expect(component.selectedState());

        fixture.componentRef.destroy();

        component.updateObservableValue(3);
        expect(component.selectedState()).toBe(2);
    });

    it('should unsubscribe an effect on destroy', () => {
        const effectCallback = jest.fn<void, [number]>();

        @Component({
            selector: 'mini-rx-my-comp',
            template: ``,
        })
        class WelcomeComponent {
            private cs = createComponentStore(counterInitialState);
            private myEffect = this.cs.rxEffect<number>(pipe(tap((v) => effectCallback(v))));
            private counterSource = new Subject<number>();

            constructor() {
                // Trigger effect with the counterSource Subject
                this.myEffect(this.counterSource);
            }

            updateObservableValue(v: number) {
                this.counterSource.next(v);
            }

            updateEffectValueImperatively(v: number) {
                this.myEffect(v);
            }
        }

        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(WelcomeComponent);
        const component = fixture.componentInstance;
        expect(component).toBeDefined();

        component.updateObservableValue(1);
        component.updateObservableValue(2);

        // Trigger effect imperatively (just to cover both ways to trigger an effect)
        component.updateEffectValueImperatively(3);
        component.updateEffectValueImperatively(4);

        fixture.componentRef.destroy();

        component.updateObservableValue(5);
        component.updateEffectValueImperatively(6);

        expect(effectCallback.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it('should throw when calling `configureComponentStores` more than once', () => {
        globalCsConfig.set({ extensions: [] });
        expect(() => globalCsConfig.set({ extensions: [] })).toThrowError(
            '@mini-rx: `configureComponentStores` was called multiple times.'
        );
    });

    it('should throw when using undo without extension', () => {
        const cs = setup({});

        expect(() => cs.undo({ type: 'someType' })).toThrowError(
            '@mini-rx: ComponentStore has no UndoExtension yet.'
        );
    });
});
