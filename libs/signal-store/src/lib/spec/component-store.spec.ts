import {
    _resetConfig,
    ComponentStore,
    configureComponentStores,
    createComponentStore,
} from '../component-store';
import { counterInitialState, CounterState, userState } from './_spec-helpers';
import { Observable, of, pipe, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createComponentStateSelector, createSelector } from '../signal-selector';
import {
    ComponentStoreConfig,
    ComponentStoreExtension,
    ExtensionId,
    StoreExtension,
} from '../models';
import { LoggerExtension } from '../extensions/logger.extension';
import { UndoExtension } from '../extensions/undo.extension';
import { ImmutableStateExtension } from '../extensions/immutable-state.extension';
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

        cs.update((state) => ({ counter: state.counter + 1 }));
        expect(selectedState()).toEqual({ counter: 2 });
    });

    it('should update state partially', () => {
        const cs = setup(userState);

        const selectedState = cs.select();
        expect(selectedState()).toBe(userState);

        cs.update(() => ({ firstName: 'Nicolas' }));
        expect(selectedState()).toEqual({ ...userState, firstName: 'Nicolas' });
    });

    it('should update state using an Observable', () => {
        const cs = setup(counterInitialState);

        const counterState$: Observable<CounterState> = of(2, 3, 4, 5).pipe(
            map((v) => ({ counter: v }))
        );

        const selectedState = cs.select((state) => state.counter);

        expect(selectedState()).toBe(1);

        // setState with Observable
        cs.update(counterState$);

        expect(selectedState()).toBe(5);

        // "normal" setState
        cs.update((state) => ({ counter: state.counter + 1 }));
        expect(selectedState()).toBe(6);

        cs.update((state) => ({ counter: state.counter + 1 }));
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
            counterSignal = signal({ counter: 2 });

            selectedCounterState = this.myCs.select((state) => state.counter);

            constructor(public myCs: MyComponentStore) {}

            startUpdatingStateWithSignal() {
                this.myCs.update(this.counterSignal);
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

        component.counterSignal.set({ counter: 3 });
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
        cs.update({ counter: 2 });
        selectedState();
        cs.update({ counter: 2 });
        selectedState();
        cs.update({ counter: 3 });
        selectedState();
        cs.update({ counter: 3 });
        selectedState();
        cs.update({ counter: 4 });
        selectedState();

        expect(getCounterSpy.mock.calls).toEqual([[1], [2], [2], [3], [3], [4]]); // No memoization: because a new state object is created for every call of `update`
        expect(getSquareCounterSpy.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it('should dispatch an Action when updating state', () => {
        const cs = setup(counterInitialState);

        const spy = jest.fn();
        cs['actionsOnQueue'].actions$.subscribe(spy);

        const setStateCallback = (state: CounterState) => ({ counter: state.counter + 1 });
        cs.update(setStateCallback);
        expect(spy).toHaveBeenCalledWith({
            setStateActionType: '@mini-rx/component-store',
            type: '@mini-rx/component-store/set-state',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        // With setState name
        cs.update(setStateCallback, 'increment');
        expect(spy).toHaveBeenCalledWith({
            setStateActionType: '@mini-rx/component-store',
            type: '@mini-rx/component-store/set-state/increment',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        // With setState name (when passing an Observable to setState)
        cs.update(of(1, 2).pipe(map((v) => ({ counter: v }))), 'updateCounterFromObservable');
        expect(spy.mock.calls).toEqual([
            [
                {
                    setStateActionType: '@mini-rx/component-store',
                    type: '@mini-rx/component-store/set-state/updateCounterFromObservable',
                    stateOrCallback: {
                        counter: 1,
                    },
                },
            ],
            [
                {
                    setStateActionType: '@mini-rx/component-store',
                    type: '@mini-rx/component-store/set-state/updateCounterFromObservable',
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

        cs.destroy();

        expect(spy.mock.calls).toEqual([
            [
                {
                    type: '@mini-rx/component-store/destroy',
                },
            ],
        ]);
    });

    it('should unsubscribe from setState Observable on destroy', () => {
        const cs = setup(counterInitialState);

        const counterSource = new Subject<number>();
        const counterState$: Observable<CounterState> = counterSource.pipe(
            map((v) => ({ counter: v }))
        );

        const selectedState = cs.select((state) => state.counter);

        cs.update(counterState$);

        expect(selectedState()).toBe(1);

        counterSource.next(1);
        expect(selectedState()).toBe(1);
        counterSource.next(2);
        expect(selectedState()).toBe(2);

        cs.destroy();

        counterSource.next(3);
        expect(selectedState()).toBe(2);
    });

    it('should unsubscribe an effect on destroy', () => {
        const effectCallback = jest.fn<void, [number]>();

        const cs = setup(counterInitialState);
        const myEffect = cs.rxEffect<number>(pipe(tap((v) => effectCallback(v))));

        const counterSource = new Subject<number>();

        // Trigger effect with the counterSource Subject
        myEffect(counterSource);

        counterSource.next(1);
        counterSource.next(2);

        // Trigger effect imperatively (just to cover both ways to trigger an effect)
        myEffect(3);
        myEffect(4);

        cs.destroy();

        counterSource.next(5);
        myEffect(6);

        expect(effectCallback.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it('should throw when calling `configureComponentStores` more than once', () => {
        configureComponentStores({ extensions: [] });
        expect(() => configureComponentStores({ extensions: [] })).toThrowError(
            '@mini-rx: `configureComponentStores` was called multiple times.'
        );
    });

    it('should throw when using undo without extension', () => {
        const cs = setup({});

        expect(() => cs.undo({ type: 'someType' })).toThrowError(
            '@mini-rx: ComponentStore has no UndoExtension yet.'
        );
    });

    it('should throw when a not supported extension is used', () => {
        class MyExtension extends StoreExtension {
            id: ExtensionId = ExtensionId.LOGGER;

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            init(): void {}
        }

        expect(() =>
            setup(
                {},
                {
                    extensions: [new MyExtension() as ComponentStoreExtension],
                }
            )
        ).toThrowError('@mini-rx: Extension "MyExtension" is not supported by Component Store.');
    });

    describe('Extensions', () => {
        beforeEach(() => {
            _resetConfig();
        });

        it('should be local', () => {
            const extensions = [new LoggerExtension(), new UndoExtension()];
            const cs = setup({}, { extensions });

            expect(cs['extensions']).toBe(extensions);
        });

        it('should be global', () => {
            const extensions = [new LoggerExtension(), new UndoExtension()];

            configureComponentStores({ extensions });
            const cs = setup({});

            expect(cs['extensions']).toBe(extensions);
        });

        it('should be merged', () => {
            const globalExtensions = [new LoggerExtension(), new ImmutableStateExtension()];
            const localExtensions = [new UndoExtension()];

            configureComponentStores({ extensions: globalExtensions });
            const cs = setup({}, { extensions: localExtensions });

            expect(cs['extensions'][0]).toBe(localExtensions[0]);
            expect(cs['extensions'][1]).toBe(globalExtensions[0]);
            expect(cs['extensions'][2]).toBe(globalExtensions[1]);
        });

        it('should be merged (use local if extension is used globally and locally)', () => {
            const globalExtensions = [new LoggerExtension(), new ImmutableStateExtension()];
            const localExtensions = [new LoggerExtension()];

            configureComponentStores({ extensions: globalExtensions });
            const cs = setup({}, { extensions: localExtensions });

            expect(cs['extensions'][0]).toBe(localExtensions[0]);
            expect(cs['extensions'][1]).toBe(globalExtensions[1]);
        });
    });
});
