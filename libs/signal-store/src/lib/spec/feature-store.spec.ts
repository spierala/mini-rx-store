import { createFeatureStore, FeatureStore } from '../feature-store';
import { mergeMap, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { createFeatureStateSelector, createSelector } from '../signal-selector';
import { cold, hot } from 'jest-marbles';
import {
    counterInitialState,
    counterReducer,
    CounterState,
    resetStoreConfig,
    userState,
    UserState,
} from './_spec-helpers';
import { Action, Actions, FeatureConfig, Reducer, StoreConfig } from '../models';
import { tapResponse } from '../tap-response';
import { addMetaReducers } from '../store-core';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '../ng-modules/store.module';
import { Store } from '../store';
import { Signal } from '@angular/core';

let store: Store;
let actions: Actions;

function setup(
    config: StoreConfig<any> = {},
    feature?: { key: string; reducer: Reducer<any>; config?: Partial<FeatureConfig<any>> }
) {
    let moduleImports: any[] = [StoreModule.forRoot(config)];
    if (feature) {
        moduleImports = [
            ...moduleImports,
            StoreModule.forFeature(feature.key, feature.reducer, feature.config),
        ];
    }

    TestBed.configureTestingModule({
        imports: moduleImports,
    });

    store = TestBed.inject(Store);
    actions = TestBed.inject(Actions);
}

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

const getUserFeatureState = createFeatureStateSelector<UserState>('user2'); // Select From App State
const getCity = createSelector(getUserFeatureState, (state) => state.city);

const getUserFeatureState2 = createFeatureStateSelector<UserState>(); // Select directly from Feature State by omitting the Feature name
const getCountry = createSelector(getUserFeatureState2, (state) => state.country);

setup({}, { key: 'someFeature', reducer: counterReducer });
const getSomeFeatureSelector = createFeatureStateSelector<CounterState>('someFeature');

class UserFeatureStore extends FeatureStore<UserState> {
    firstName$ = this.select((state) => state.firstName);
    lastName$ = this.select((state) => state.lastName);
    country$ = this.select(getCountry);
    city$ = store.select(getCity);
    someFeatureState$ = store.select(getSomeFeatureSelector);

    loadFn = this.rxEffect((payload$) =>
        payload$.pipe(mergeMap(() => fakeApiGet().pipe(tap((user) => this.update(user)))))
    );

    loadFnWithError = this.rxEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiWithError().pipe(
                    tapResponse(
                        (user) => this.update(user),
                        (err) => {
                            this.update({ err: 'error' });
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
        this.update({ firstName });
    }

    updateLastName(lastName: string) {
        this.update({ lastName });
    }

    updateCity(city: string) {
        this.update({ city }, 'updateCity');
    }

    updateCountry(country: string) {
        this.update({
            ...this.state, // Test updating state using `this.state`
            country,
        });
    }

    resetState() {
        this.update(initialState);
    }
}

class CounterFeatureStore extends FeatureStore<CounterState> {
    counter$: Signal<number> = this.select((state) => state.counter);

    constructor() {
        super('counterFeature', { counter: 0 });
    }

    increment() {
        // Update state using callback
        this.update((state) => ({ counter: state.counter + 1 }));
    }
}

const userFeature: UserFeatureStore = new UserFeatureStore();
const counterFeature: CounterFeatureStore = new CounterFeatureStore();

describe('FeatureStore', () => {
    it('should initialize the feature', () => {
        const spy = jest.fn();
        const selectedState = userFeature.select();
        expect(selectedState()).toBe(initialState);
    });

    it('should expose the feature key', () => {
        expect(userFeature.featureKey).toBe('user2');
    });

    it('should update state', () => {
        userFeature.updateFirstName('Nicolas');
        expect(userFeature.firstName$()).toBe('Nicolas');

        userFeature.updateLastName('Cage');
        expect(userFeature.lastName$()).toBe('Cage');

        userFeature.updateCountry('Belgium');
        expect(userFeature.country$()).toBe('Belgium');

        userFeature.resetState();
    });

    it('should update state using callback', () => {
        expect(counterFeature.counter$()).toBe(0);
        counterFeature.increment();
        expect(counterFeature.counter$()).toBe(1);
        counterFeature.increment();
        expect(counterFeature.counter$()).toBe(2);
    });

    it('should select state from App State', () => {
        expect(userFeature.city$()).toBe('LA');
    });

    it('should select state from Feature State', () => {
        expect(userFeature.country$()).toBe('United States');
    });

    it('should select state from another Feature (created with Store.feature)', () => {
        expect(userFeature.someFeatureState$()).toBe(counterInitialState);
    });

    //
    // it('should create and execute an effect', () => {
    //     userFeature.loadFn();
    //     expect(userFeature.firstName$).toBeObservable(hot('a--b', { a: 'Bruce', b: 'Steven' }));
    // });
    //
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
    //
    // it('should create and execute an effect and handle error', () => {
    //     userFeature.resetState();
    //     userFeature.loadFnWithError();
    //     expect(userFeature.select()).toBeObservable(
    //         hot('ab', { a: initialState, b: { ...initialState, err: 'error' } })
    //     );
    // });
    //
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
            mergeMap(() => apiCallWithError().pipe(tap(() => fs.update({}))))
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
        actions.subscribe(spy);
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

        const getFeatureState = createFeatureStateSelector<CounterState>();
        const getCounter = createSelector(getFeatureState, (state) => state.counter);

        const counter$: Signal<number> = fs.select(getCounter);

        function inc() {
            fs.update((state) => ({
                counter: state.counter + 1,
            }));
        }

        expect(counter$()).toBe(1);

        inc();

        expect(counter$()).toBe(2);
    });

    it('should remove the feature state when Feature Store is destroyed', () => {
        resetStoreConfig();

        const fs: FeatureStore<CounterState> = createFeatureStore<CounterState>(
            'tempFsState',
            counterInitialState
        );

        const selectedState = store.select((state) => state);
        expect(selectedState()).toEqual({ tempFsState: counterInitialState });

        const actionSpy = jest.fn();
        actions.subscribe(actionSpy);

        fs.destroy();
        expect(selectedState()).toEqual({});

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

    it('should allow many instances of the same Feature Store with config.multi', () => {
        const featureKey = 'multi-counter';

        class Fs extends FeatureStore<CounterState> {
            constructor() {
                super(featureKey, counterInitialState, { multi: true });
            }

            increment(): Action {
                return this.update((state) => ({
                    counter: state.counter + 1,
                }));
            }
        }

        const fs1 = new Fs();
        const fs2 = new Fs();
        const fs3 = createFeatureStore(featureKey, counterInitialState, { multi: true }); // Functional creation method should also support multi: true

        function incrementFs3(): void {
            fs3.update((state) => ({ counter: state.counter + 1 }));
        }

        const fs1FeatureKey = fs1.featureKey;
        const getFs1Feature = createFeatureStateSelector<CounterState>(fs1FeatureKey);
        const getFs1Counter = createSelector(getFs1Feature, (state) => state?.counter);
        const fs1Counter = store.select(getFs1Counter);

        const fs2FeatureKey = fs2.featureKey;
        const getFs2Feature = createFeatureStateSelector<CounterState>(fs2FeatureKey);
        const getFs2Counter = createSelector(getFs2Feature, (state) => state.counter);
        const fs2Counter = store.select(getFs2Counter);

        const fs3FeatureKey = fs3.featureKey;
        const getFs3Feature = createFeatureStateSelector<CounterState>(fs3FeatureKey);
        const getFs3Counter = createSelector(getFs3Feature, (state) => state.counter);
        const fs3Counter = store.select(getFs3Counter);

        expect(fs1Counter()).toBe(1);
        fs1.increment();
        expect(fs1Counter()).toBe(2);
        fs1.increment();
        expect(fs1Counter()).toBe(3);

        expect(fs2Counter()).toBe(1);
        fs2.increment();
        expect(fs2Counter()).toBe(2);
        fs2.increment();
        expect(fs2Counter()).toBe(3);

        expect(fs3Counter()).toBe(1);
        incrementFs3();
        expect(fs3Counter()).toBe(2);
        incrementFs3();
        expect(fs3Counter()).toBe(3);

        fs1.destroy();
        expect(fs1Counter()).toBe(undefined);

        expect(fs1.featureKey).toContain('multi-counter-');
        expect(fs2.featureKey).toContain('multi-counter-');
        expect(fs3.featureKey).toContain('multi-counter-');
    });
});