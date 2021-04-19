import { FeatureStore } from '../feature-store';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { createFeatureSelector, createSelector } from '../selector';
import { cold, hot } from 'jest-marbles';
import { actions$, createFeatureStore } from '../store';
import StoreCore from '../store-core';
import { counterInitialState, counterReducer, CounterState, store } from './_spec-helpers';
import { Action, Reducer } from '../models';

interface UserState {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    err: string;
}

const initialState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
    city: 'LA',
    country: 'United States',
    err: undefined,
};

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

class FeatureState extends FeatureStore<UserState> {
    firstName$ = this.select((state) => state.firstName);
    lastName$ = this.select((state) => state.lastName);
    country$ = this.select(getCountry);
    city$ = store.select(getCity);
    someFeatureState$ = store.select(getSomeFeatureSelector);

    loadFn = this.effect((payload$) =>
        payload$.pipe(mergeMap(() => fakeApiGet().pipe(tap((user) => this.setState(user)))))
    );

    loadFnWithError = this.effect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiWithError().pipe(
                    tap((user) => this.setState(user)),
                    catchError((err) => {
                        this.setState({ err: 'error' });
                        return EMPTY;
                    })
                )
            )
        )
    );

    constructor() {
        super('user2', initialState);
    }

    updateFirstName(firstName) {
        this.setState({ firstName });
    }

    updateLastName(lastName) {
        this.setState({ lastName });
    }

    updateCity(city) {
        this.setState({ city }, 'updateCity');
    }

    updateCountry(country) {
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

class CounterFeature2 extends FeatureStore<any> {
    constructor() {
        super('counterFeature2', {});
    }
}

const userFeature: FeatureState = new FeatureState();
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

    it('should create and execute an effect and handle error', () => {
        userFeature.resetState();
        userFeature.loadFnWithError();
        expect(userFeature.select()).toBeObservable(
            hot('ab', { a: initialState, b: { ...initialState, err: 'error' } })
        );
    });

    it('should dispatch a set-state default action', () => {
        userFeature.resetState();

        const spy = jest.fn();
        actions$.subscribe(spy);
        userFeature.updateCity('NY');
        expect(spy).toHaveBeenCalledWith({
            type: '@mini-rx/user2/set-state/updateCity',
            payload: { city: 'NY' },
        });
    });

    it('should dispatch a set-state default action with meta data', () => {
        userFeature.resetState();

        const spy = jest.fn();
        StoreCore['actionsWithMetaSource'].subscribe(spy);
        userFeature.updateCity('NY');
        expect(spy).toHaveBeenCalledWith({
            action: {
                type: '@mini-rx/user2/set-state/updateCity',
                payload: { city: 'NY' },
            },
            meta: {
                onlyForFeature: 'user2',
            },
        });
    });

    it('should only run its own feature state reducer when Feature.setState is called', () => {
        expect(reducerSpy).toHaveBeenCalledTimes(1); // 1 for initializing the feature state reducer with an initial action
        reducerSpy.mockReset();
    });

    it('should NOT run the redux reducers when a new feature state is added', () => {
        const counterFeature = new CounterFeature2();
        expect(reducerSpy).toHaveBeenCalledTimes(0);
        reducerSpy.mockReset();
    });

    it('should run the meta reducers when state changes', () => {
        const metaReducerSpy = jest.fn();

        function metaReducer(reducer): Reducer<any> {
            return (state, action: Action) => {
                metaReducerSpy();

                return reducer(state, action);
            };
        }

        StoreCore.addMetaReducers(metaReducer);

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
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ tempFsState: counterInitialState }));

        fs.destroy();
        expect(spy).toHaveBeenCalledWith(expect.not.objectContaining({ tempCounter: counterInitialState }));
    });
});
