import { _resetConfig, configureComponentStores, createComponentStore } from '../component-store';
import { counterInitialState, CounterState, userState } from './_spec-helpers';
import { Observable, of, pipe, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
    createComponentStateSelector,
    createSelector,
    ImmutableStateExtension,
    LoggerExtension,
    UndoExtension,
} from 'mini-rx-store';

describe('ComponentStore', () => {
    it('should initialize the store', () => {
        const cs = createComponentStore(counterInitialState);

        const spy = jest.fn();
        cs.select().subscribe(spy);
        expect(spy).toHaveBeenCalledWith(counterInitialState);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state', () => {
        const cs = createComponentStore(counterInitialState);

        const spy = jest.fn();
        cs.select().subscribe(spy);
        expect(spy).toHaveBeenCalledWith(counterInitialState);
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        cs.setState((state) => ({ counter: state.counter + 1 }));
        expect(spy).toHaveBeenCalledWith({ counter: 2 });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state partially', () => {
        const cs = createComponentStore(userState);

        const spy = jest.fn();
        cs.select().subscribe(spy);
        expect(spy).toHaveBeenCalledWith(userState);
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        cs.setState(() => ({ firstName: 'Nicolas' }));
        expect(spy).toHaveBeenCalledWith({ ...userState, firstName: 'Nicolas' });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state using an Observable', () => {
        const cs = createComponentStore(counterInitialState);

        const counterState$: Observable<CounterState> = of(2, 3, 4, 5).pipe(
            map((v) => ({ counter: v }))
        );

        const subscribeCallback = jest.fn<void, [number]>();
        cs.select((state) => state.counter).subscribe(subscribeCallback);

        // setState with Observable
        cs.setState(counterState$);

        // "normal" setState
        cs.setState((state) => ({ counter: state.counter + 1 }));
        cs.setState((state) => ({ counter: state.counter + 1 }));

        expect(subscribeCallback.mock.calls).toEqual([[1], [2], [3], [4], [5], [6], [7]]);
    });

    it('should select state with memoized selectors', () => {
        const getCounterSpy = jest.fn<void, [number]>();
        const getSquareCounterSpy = jest.fn<void, [number]>();

        const cs = createComponentStore(counterInitialState);

        const getComponentState = createComponentStateSelector<CounterState>();
        const getCounter = createSelector(getComponentState, (state) => {
            getCounterSpy(state.counter);
            return state.counter;
        });
        const getSquareCounter = createSelector(getCounter, (counter) => {
            getSquareCounterSpy(counter);
            return counter * 2;
        });

        cs.select(getSquareCounter).subscribe();

        cs.setState({ counter: 2 });
        cs.setState({ counter: 2 });
        cs.setState({ counter: 3 });
        cs.setState({ counter: 3 });
        cs.setState({ counter: 4 });

        expect(getCounterSpy.mock.calls).toEqual([[1], [2], [2], [3], [3], [4]]); // No memoization: because a new state object is created for every call of `setState`
        expect(getSquareCounterSpy.mock.calls).toEqual([[1], [2], [3], [4]]);
    });

    it('should dispatch an Action when updating state', () => {
        const cs = createComponentStore(counterInitialState);

        const spy = jest.fn();
        cs['actionsOnQueue'].actions$.subscribe(spy);

        const setStateCallback = (state: CounterState) => ({ counter: state.counter + 1 });
        cs.setState(setStateCallback);
        expect(spy).toHaveBeenCalledWith({
            setStateActionType: '@mini-rx/component-store',
            type: '@mini-rx/component-store/set-state',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        // With setState name
        cs.setState(setStateCallback, 'increment');
        expect(spy).toHaveBeenCalledWith({
            setStateActionType: '@mini-rx/component-store',
            type: '@mini-rx/component-store/set-state/increment',
            stateOrCallback: setStateCallback,
        });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe from setState Observable on destroy', () => {
        const cs = createComponentStore(counterInitialState);

        const counterSource = new Subject<number>();
        const counterState$: Observable<CounterState> = counterSource.pipe(
            map((v) => ({ counter: v }))
        );

        const subscribeCallback = jest.fn<void, [number]>();
        cs.select((state) => state.counter).subscribe(subscribeCallback);

        cs.setState(counterState$);

        counterSource.next(1);
        counterSource.next(2);

        cs.destroy();

        counterSource.next(3);

        expect(subscribeCallback.mock.calls).toEqual([[1], [2]]);
    });

    it('should unsubscribe an effect on destroy', () => {
        const effectCallback = jest.fn<void, [number]>();

        const cs = createComponentStore(counterInitialState);
        const myEffect = cs.effect<number>(pipe(tap((v) => effectCallback(v))));

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

    it('should initialize the store lazily', () => {
        const cs = createComponentStore();

        const spy = jest.fn();
        cs.select().subscribe(spy);
        expect(spy).toHaveBeenCalledTimes(0);

        cs.setInitialState(counterInitialState);
        expect(spy).toHaveBeenCalledWith(counterInitialState);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state of the lazily initialized store', () => {
        const cs = createComponentStore<CounterState>();

        const spy = jest.fn();
        cs.select().subscribe(spy);
        expect(spy).toHaveBeenCalledTimes(0);

        spy.mockReset();

        cs.setInitialState(counterInitialState);
        expect(spy).toHaveBeenCalledWith(counterInitialState);
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        cs.setState((state) => ({ counter: state.counter + 1 }));
        expect(spy).toHaveBeenCalledWith({ counter: 2 });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw when accessing not initialized state', () => {
        const cs = createComponentStore();
        expect(() => cs.state).toThrowError(
            '@mini-rx: ComponentStore has no initialState yet. Please provide an initialState before updating/getting state.'
        );
    });

    it('should throw when updating state and no initial state was provided', () => {
        const cs = createComponentStore();
        expect(() => cs.setState((state) => state)).toThrowError(
            '@mini-rx: ComponentStore has no initialState yet. Please provide an initialState before updating/getting state.'
        );
    });

    it('should throw when calling setInitialState, but initial state was provided already', () => {
        const cs = createComponentStore(counterInitialState);
        expect(() => cs.setInitialState(counterInitialState)).toThrowError(
            '@mini-rx: ComponentStore has initialState already.'
        );

        const cs2 = createComponentStore();
        cs2.setInitialState(counterInitialState);
        expect(() => cs.setInitialState(counterInitialState)).toThrowError(
            '@mini-rx: ComponentStore has initialState already.'
        );
    });

    it('should throw when calling `configureComponentStores` more than once', () => {
        configureComponentStores({ extensions: [] });
        expect(() => configureComponentStores({ extensions: [] })).toThrowError(
            '@mini-rx: `configureComponentStores` was called multiple times.'
        );
    });

    it('should throw when using undo without extension', () => {
        const cs = createComponentStore();

        expect(() => cs.undo({ type: 'someType' })).toThrowError(
            '@mini-rx: ComponentStore has no UndoExtension yet.'
        );
    });

    it('should throw when a not supported extension is used', () => {
        const loggerExtension = new LoggerExtension();
        // @ts-ignore
        loggerExtension.hasCsSupport = false;

        expect(() =>
            createComponentStore(undefined, { extensions: [loggerExtension] })
        ).toThrowError(
            '@mini-rx: Extension "LoggerExtension" is not supported by Component Store.'
        );
    });

    describe('Extensions', () => {
        beforeEach(() => {
            _resetConfig();
        });

        it('should be local', () => {
            const extensions = [new LoggerExtension(), new UndoExtension()];
            const cs = createComponentStore(undefined, { extensions });

            expect(cs['extensions']).toBe(extensions);
        });

        it('should be global', () => {
            const extensions = [new LoggerExtension(), new UndoExtension()];

            configureComponentStores({ extensions });
            const cs = createComponentStore(undefined);

            expect(cs['extensions']).toBe(extensions);
        });

        it('should be merged', () => {
            const globalExtensions = [new LoggerExtension(), new ImmutableStateExtension()];
            const localExtensions = [new UndoExtension()];

            configureComponentStores({ extensions: globalExtensions });
            const cs = createComponentStore(undefined, { extensions: localExtensions });

            expect(cs['extensions'][0]).toBe(localExtensions[0]);
            expect(cs['extensions'][1]).toBe(globalExtensions[0]);
            expect(cs['extensions'][2]).toBe(globalExtensions[1]);
        });

        it('should be merged (use local if extension is used globally and locally)', () => {
            const globalExtensions = [new LoggerExtension(), new ImmutableStateExtension()];
            const localExtensions = [new LoggerExtension()];

            configureComponentStores({ extensions: globalExtensions });
            const cs = createComponentStore(undefined, { extensions: localExtensions });

            expect(cs['extensions'][0]).toBe(localExtensions[0]);
            expect(cs['extensions'][1]).toBe(globalExtensions[1]);
        });
    });
});
