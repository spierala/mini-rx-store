import { createComponentStore } from '../component-store';
import { counterInitialState, CounterState, userState } from './_spec-helpers';
import { Observable, of, pipe, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
});
