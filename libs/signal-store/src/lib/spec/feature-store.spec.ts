import { createFeatureStore, FeatureStore } from '../feature-store';
import { mergeMap, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { createFeatureSelector, createSelector } from '../selector';
import { cold, hot } from 'jest-marbles';
import {
    counterInitialState,
    counterReducer,
    CounterState,
    store,
    userState,
    UserState,
} from './_spec-helpers';
import { Action, Reducer } from '../models';
import { tapResponse } from '../tap-response';
import { actions$, addMetaReducers } from '../store-core';

const initialState: UserState = userState;

const asyncUser: UserState = {
    firstName: 'Steven',
    lastName: 'Seagal',
    city: 'LA',
    country: 'United States',
    err: '',
};

function fakeApiGet(): Observable<UserState> {
    return cold('---a', { a: asyncUser });
}

function fakeApiWithError(): Observable<UserState> {
    return cold('-#');
}

const getUserFeatureState = createFeatureSelector<UserState>('user2'); // Select From App State
const getCity = createSelector(getUserFeatureState, (state) => state.city);

const getUserFeatureState2 = createFeatureSelector<UserState>(); // Select directly from Feature State by omitting the Feature name
const getCountry = createSelector(getUserFeatureState2, (state) => state.country);

store.feature<CounterState>('someFeature', counterReducer);
const getSomeFeatureSelector = createFeatureSelector<CounterState>('someFeature');

class UserFeatureStore extends FeatureStore<UserState> {
    firstName$ = this.select((state) => state.firstName);
    lastName$ = this.select((state) => state.lastName);
    country$ = this.select(getCountry);
    city$ = store.select(getCity);
    someFeatureState$ = store.select(getSomeFeatureSelector);

    loadFn = this.rxEffect((payload$) =>
        payload$.pipe(mergeMap(() => fakeApiGet().pipe(tap((user) => this.setState(user)))))
    );

    loadFnWithError = this.rxEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiWithError().pipe(
                    tapResponse(
                        (user) => this.setState(user),
                        (err) => {
                            this.setState({ err: 'error' });
                        }
                    )
                )
            )
        )
    );

    constructor() {
        super('user2', initialState);
    }

    updateFirstName(firstName: string) {
        this.setState({ firstName });
    }

    updateLastName(lastName: string) {
        this.setState({ lastName });
    }

    updateCity(city: string) {
        this.setState({ city }, 'updateCity');
    }

    updateCountry(country: string) {
        this.setState({
            ...this.state, // Test updating state using `this.state`
            country,
        });
    }

    resetState() {
        this.setState(initialState);
    }
}

class CounterFeature extends FeatureStore<CounterState> {
    counter$: Observable<number> = this.select((state) => state.counter);

    constructor() {
        super('counterFeature', { counter: 0 });
    }

    increment() {
        // Update state using callback
        this.setState((state) => ({ counter: state.counter + 1 }));
    }
}

const userFeature: UserFeatureStore = new UserFeatureStore();
const counterFeature: CounterFeature = new CounterFeature();

describe('FeatureStore', () => {
    const reducerSpy = jest.fn();

    function someReducer() {
        reducerSpy();
    }

    store.feature('someReduxReducer', someReducer);

    it('should initialize the feature', () => {
        const spy = jest.fn();
        userFeature.select().subscribe(spy);
        expect(spy).toHaveBeenCalledWith(initialState);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should expose the feature key', () => {
        expect(userFeature.featureKey).toBe('user2');
    });

    it('should update state', () => {
        userFeature.updateFirstName('Nicolas');
        const spy = jest.fn();
        userFeature.firstName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Nicolas');
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        userFeature.updateLastName('Cage');
        userFeature.lastName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Cage');
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockReset();

        userFeature.updateCountry('Belgium'); // Test updating state using `this.state`
        userFeature.country$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Belgium');
        expect(spy).toHaveBeenCalledTimes(1);

        userFeature.resetState();
    });

    it('should update state using callback', () => {
        const spy = jest.fn();
        counterFeature.counter$.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);
        expect(spy).toHaveBeenCalledTimes(1);

        counterFeature.increment();
        expect(spy).toHaveBeenCalledWith(1);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should select state from App State', () => {
        const spy = jest.fn();
        userFeature.city$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('LA');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should select state from Feature State', () => {
        const spy = jest.fn();
        userFeature.country$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('United States');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should select state from another Feature (created with Store.feature)', () => {
        const spy = jest.fn();
        userFeature.someFeatureState$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith(counterInitialState);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should create and execute an effect', () => {
        userFeature.loadFn();
        expect(userFeature.firstName$).toBeObservable(hot('a--b', { a: 'Bruce', b: 'Steven' }));
    });

    it('should invoke effect via Observable or imperatively', () => {
        const spy = jest.fn();

        function apiCall(param: number) {
            spy(param);
            return of('someValue');
        }

        const effect = userFeature.rxEffect<number>(mergeMap((v) => apiCall(v)));
        effect(1);

        const source = new Subject<number>();
        const source2 = new Subject<number>();

        effect(source);

        source.next(2);
        source.next(3);
        effect(4);

        effect(source2);

        source2.next(11);
        source.complete();
        source2.next(12);

        effect(5);

        expect(spy.mock.calls).toEqual([[1], [2], [3], [4], [11], [12], [5]]);
    });

    it('should create and execute an effect and handle error', () => {
        userFeature.resetState();
        userFeature.loadFnWithError();
        expect(userFeature.select()).toBeObservable(
            hot('ab', { a: initialState, b: { ...initialState, err: 'error' } })
        );
    });

    it('should resubscribe the effect 10 times (if side effect error is not handled)', () => {
        const spy = jest.fn();
        console.error = jest.fn();

        function apiCallWithError() {
            spy();
            throw new Error();
            return of('someValue');
        }

        const fs: FeatureStore<any> = createFeatureStore('fsWithFailingApi', {});

        const load = fs.rxEffect<void>(
            mergeMap(() => apiCallWithError().pipe(tap(() => fs.setState({}))))
        );

        load();
        load();
        load();
        load();
        load();
        load();
        load();
        load();
        load();
        load();
        load();
        load(); // #12 will not trigger the Api call anymore
        load(); // #13 will not trigger the Api call anymore

        expect(spy).toHaveBeenCalledTimes(11); // Api call is performed 11 Times. First time + 10 re-subscriptions

        function getErrorMsg(times: number) {
            return `@mini-rx: An error occurred in the Effect. MiniRx resubscribed the Effect automatically and will do so ${times} more times.`;
        }

        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(9)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(8)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(7)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(6)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(5)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(4)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(3)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(2)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(1)),
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(getErrorMsg(0)),
            expect.any(Error)
        );

        expect(console.error).toHaveBeenCalledTimes(10); // Re-subscription with error logging stopped after 10 times
    });

    it('should dispatch a set-state action', () => {
        userFeature.resetState();

        const spy = jest.fn();
        actions$.subscribe(spy);
        userFeature.updateCity('NY');
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                setStateActionType: '@mini-rx/feature-store',
                type: '@mini-rx/user2/set-state/updateCity',
                stateOrCallback: { city: 'NY' },
                featureId: expect.any(String),
            })
        );
    });

    it('should run the meta reducers when state changes', () => {
        const metaReducerSpy = jest.fn();

        function metaReducer(reducer: Reducer<any>): Reducer<any> {
            return (state, action: Action) => {
                metaReducerSpy();

                return reducer(state, action);
            };
        }

        addMetaReducers(metaReducer);

        userFeature.updateCity('NY');
        counterFeature.increment();

        expect(metaReducerSpy).toHaveBeenCalledTimes(2);
    });

    it('should create a Feature Store with functional creation methods', () => {
        const fs: FeatureStore<CounterState> = createFeatureStore<CounterState>(
            'funcFeatureStore',
            counterInitialState
        );

        const getFeatureState = createFeatureSelector<CounterState>();
        const getCounter = createSelector(getFeatureState, (state) => state.counter);

        const counter$: Observable<number> = fs.select(getCounter);

        function inc() {
            fs.setState((state) => ({
                counter: state.counter + 1,
            }));
        }

        const spy = jest.fn();

        counter$.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(1);

        inc();

        expect(spy).toHaveBeenCalledWith(2);
    });

    it('should remove the feature state when Feature Store is destroyed', () => {
        const fs: FeatureStore<CounterState> = createFeatureStore<CounterState>(
            'tempFsState',
            counterInitialState
        );

        const spy = jest.fn();
        store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ tempFsState: counterInitialState })
        );

        const actionSpy = jest.fn();
        actions$.subscribe(actionSpy);

        fs.destroy();
        expect(spy).toHaveBeenCalledWith(
            expect.not.objectContaining({ tempCounter: counterInitialState })
        );

        expect(actionSpy).toHaveBeenCalledWith({ type: '@mini-rx/tempFsState/destroy' });
    });

    it('should call FeatureStore.destroy when Angular ngOnDestroy is called', () => {
        const fs: FeatureStore<CounterState> = createFeatureStore<CounterState>(
            'tempFsState',
            counterInitialState
        );

        const spy = jest.spyOn(fs, 'destroy');
        fs.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });

    it('should allow many instances of the same feature store with config.multi', () => {
        const featureKey = 'multi-counter';

        class Fs extends FeatureStore<CounterState> {
            constructor() {
                super(featureKey, counterInitialState, { multi: true });
            }

            increment(): Action {
                return this.setState({
                    counter: this.state.counter + 1,
                });
            }
        }

        const fs1 = new Fs();
        const fs2 = new Fs();
        const fs3 = createFeatureStore(featureKey, counterInitialState, { multi: true }); // Functional creation method should also support multi: true

        function incrementFs4(): void {
            fs3.setState((state) => ({ counter: state.counter + 1 }));
        }

        const spy = jest.fn();
        const spy2 = jest.fn();
        const spy3 = jest.fn();

        const fs2FeatureKey = fs1.featureKey;
        const getFs2Feature = createFeatureSelector<CounterState>(fs2FeatureKey);
        const getFs2Counter = createSelector(getFs2Feature, (state) => state?.counter);

        const fs3FeatureKey = fs2.featureKey;
        const getFs3Feature = createFeatureSelector<CounterState>(fs3FeatureKey);
        const getFs3Counter = createSelector(getFs3Feature, (state) => state?.counter);

        const fs4FeatureKey = fs3.featureKey;
        const getFs4Feature = createFeatureSelector<CounterState>(fs4FeatureKey);
        const getFs4Counter = createSelector(getFs4Feature, (state) => state?.counter);

        store.select(getFs2Counter).subscribe(spy);
        store.select(getFs3Counter).subscribe(spy2);
        store.select(getFs4Counter).subscribe(spy3);

        fs1.increment();

        fs2.increment();
        fs2.increment();

        incrementFs4();
        incrementFs4();
        incrementFs4();

        fs2.destroy();

        expect(spy.mock.calls).toEqual([[1], [2]]);
        expect(spy2.mock.calls).toEqual([[1], [2], [3], [undefined]]);
        expect(spy3.mock.calls).toEqual([[1], [2], [3], [4]]);

        expect(fs2FeatureKey).toContain('multi-counter-');
        expect(fs3FeatureKey).toContain('multi-counter-');
    });
});
