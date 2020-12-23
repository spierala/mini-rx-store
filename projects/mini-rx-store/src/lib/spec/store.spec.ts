import Store, { actions$ } from '../store';
import StoreCore from '../store-core';
import { Action, Reducer } from '../interfaces';
import { createFeatureSelector, createSelector } from '../selector';
import { Observable, of } from 'rxjs';
import { ofType } from '../utils';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { ReduxDevtoolsExtension } from '../redux-devtools.extension';
import { cold, hot } from 'jest-marbles';
import { Feature } from '../feature';
import { counterInitialState, counterReducer, CounterState } from './_spec-helpers';
import { LoggerExtension } from '../logger.extension';

const asyncUser: Partial<UserState> = {
    firstName: 'Steven',
    lastName: 'Seagal',
    age: 30,
};

const updatedAsyncUser: Partial<UserState> = {
    firstName: 'Steven',
    lastName: 'Seagal',
    age: 31,
};

function fakeApiGet(): Observable<UserState> {
    return cold('---a', { a: asyncUser });
}

function fakeApiUpdate(): Observable<UserState> {
    return cold('-a', { a: updatedAsyncUser });
}

function fakeApiWithError(): Observable<UserState> {
    return cold('-#');
}

interface UserState {
    firstName: string;
    lastName: string;
    age: number;
    err: string;
}

const initialState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
    age: 30,
    err: undefined,
};

function reducer(state: UserState = initialState, action: Action): UserState {
    switch (action.type) {
        case 'updateUser':
        case 'loadUserSuccess':
        case 'saveUserSuccess':
            return {
                ...state,
                ...action.payload,
            };
        case 'resetUser':
            return initialState;
        case 'incAge':
            return {
                ...state,
                age: state.age + 1,
            };
        case 'error':
            return {
                ...state,
                err: action.payload,
            };
        default:
            return state;
    }
}

const getUserFeatureState = createFeatureSelector<UserState>('user');
const getFirstName = createSelector(getUserFeatureState, (user) => user.firstName);
const getAge = createSelector(getUserFeatureState, (user) => user.age);

const getCounterFeatureState = createFeatureSelector<CounterState>('counter');
const getCounter1 = createSelector(getCounterFeatureState, (state) => state.counter);
const getCounter2FeatureState = createFeatureSelector<CounterState>('counter2');
const getCounter2 = createSelector(getCounter2FeatureState, (state) => state.counter);

class CounterFeatureState extends Feature<CounterState> {
    constructor() {
        super('counter3', counterInitialState);
    }

    increment() {
        this.setState((state) => ({ counter: state.counter + 1 }));
    }
}

const getCounter3FeatureState = createFeatureSelector<CounterState>('counter3');
const getCounter3 = createSelector(getCounter3FeatureState, (state) => state.counter);

describe('Store', () => {
    it('should initialize the store with an empty object', () => {
        const spy = jest.fn();
        Store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({});
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should initialize a Feature state', () => {
        Store.feature<UserState>('user', reducer);

        const spy = jest.fn();
        Store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({
            user: initialState,
        });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw when reusing feature name', () => {
        expect(() => Store.feature<UserState>('user', reducer)).toThrowError();
    });

    it('should run the redux reducers when a new Feature state is added', () => {
        const reducerSpy = jest.fn();

        function someReducer() {
            reducerSpy();
        }

        Store.feature('oneMoreFeature', someReducer);
        Store.feature('oneMoreFeature2', (state) => state);
        expect(reducerSpy).toHaveBeenCalledTimes(2);
    });

    it('should update the Feature state', () => {
        const user = {
            firstName: 'Nicolas',
            lastName: 'Cage',
        };

        Store.dispatch({
            type: 'updateUser',
            payload: user,
        });

        const spy = jest.fn();
        Store.select(getFirstName).subscribe(spy);
        expect(spy).toHaveBeenCalledWith(user.firstName);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update the Feature state #1', () => {
        const age$ = Store.select(getAge);
        hot('-a-b').subscribe((value) => Store.dispatch({ type: 'incAge' }));
        expect(age$).toBeObservable(hot('ab-c', { a: 30, b: 31, c: 32 }));
    });

    it('should update the Feature state #2', () => {
        const age$ = Store.select(getAge);
        hot('(ab)').subscribe((value) => Store.dispatch({ type: 'incAge' }));
        expect(age$).toBeObservable(hot('(abc)', { a: 32, b: 33, c: 34 }));
    });

    it('should return undefined if feature does not exist yet', () => {
        const featureSelector = createFeatureSelector('notExistingFeature');

        const spy = jest.fn();
        Store.select(featureSelector).subscribe(spy);
        expect(spy).toHaveBeenCalledWith(undefined);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should create and execute an effect', () => {
        Store.dispatch({ type: 'resetUser' });

        Store.createEffect(
            actions$.pipe(
                ofType('loadUser'),
                mergeMap(() =>
                    fakeApiGet().pipe(
                        map((user) => ({
                            type: 'loadUserSuccess',
                            payload: user,
                        }))
                    )
                )
            )
        );

        Store.dispatch({ type: 'loadUser' });

        // Lets be crazy and add another effect while the other effect is busy
        cold('-a').subscribe(() => {
            Store.createEffect(
                actions$.pipe(
                    ofType('saveUser'),
                    mergeMap(() =>
                        fakeApiUpdate().pipe(
                            map((user) => ({
                                type: 'saveUserSuccess',
                                payload: user,
                            }))
                        )
                    )
                )
            );

            Store.dispatch({ type: 'saveUser' });
        });

        expect(Store.select(getUserFeatureState)).toBeObservable(
            hot('a-xb', { a: initialState, b: asyncUser, x: updatedAsyncUser })
        );
    });

    it('should create and execute an effect and handle side effect error', () => {
        Store.dispatch({ type: 'resetUser' });

        Store.createEffect(
            actions$.pipe(
                ofType('someAction'),
                mergeMap(() =>
                    fakeApiWithError().pipe(
                        map((user) => ({
                            type: 'whatever',
                        })),
                        catchError((err) => of({ type: 'error', payload: 'error' }))
                    )
                )
            )
        );

        Store.dispatch({ type: 'someAction' });

        expect(Store.select(getUserFeatureState)).toBeObservable(
            hot('ab', { a: initialState, b: { ...initialState, err: 'error' } })
        );
    });

    it('should log', () => {
        console.log = jest.fn();

        const user: UserState = {
            firstName: 'John',
            lastName: 'Travolta',
            age: 35,
            err: undefined,
        };

        const newState = {
            user,
        };

        Store.addExtension(new LoggerExtension());

        Store.dispatch({
            type: 'updateUser',
            payload: user,
        });

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('ACTION'),
            expect.anything(),
            expect.stringContaining('Type'),
            expect.stringContaining('updateUser'),
            expect.stringContaining('Payload'),
            user,
            expect.stringContaining('State'),
            newState
        );
    });

    it('should add extension', () => {
        const spy = jest.spyOn(StoreCore, 'addExtension');
        Store.addExtension(new ReduxDevtoolsExtension({}));
        expect(spy).toHaveBeenCalledTimes(1);
        expect(StoreCore['extensions'].length).toBe(2);
    });

    it('should call the reducer before running the effect', () => {
        const callOrder = [];
        const someReducer = (state, action: Action) => {
            switch (action.type) {
                case 'someAction2':
                    callOrder.push('reducer');
            }
        };
        const onEffectStarted = (): Observable<Action> => {
            callOrder.push('effect');
            return of({ type: 'whatever' });
        };

        Store.feature('someFeature', someReducer, {});

        Store.createEffect(
            actions$.pipe(
                ofType('someAction2'),
                mergeMap(() => onEffectStarted())
            )
        );

        Store.dispatch({ type: 'someAction2' });

        expect(callOrder).toEqual(['reducer', 'effect']);
    });

    it('should queue actions', () => {
        const callLimit = 5000;

        Store.feature<CounterState>('counter', counterReducer);

        const spy = jest.fn().mockImplementation((value) => {
            Store.dispatch({ type: 'counter' });
        });

        const counter1$ = Store.select(getCounter1);

        counter1$.pipe(take(callLimit)).subscribe(spy);

        expect(spy).toHaveBeenCalledTimes(callLimit);
        expect(spy).toHaveBeenNthCalledWith(callLimit, callLimit);
    });

    it('should queue effect actions', () => {
        const callLimit = 5000;

        function counter2Reducer(state: CounterState, action: Action) {
            switch (action.type) {
                case 'counterEffectSuccess':
                    return {
                        ...state,
                        counter: state.counter + 1,
                    };
                default:
                    return state;
            }
        }

        Store.feature<CounterState>('counter2', counter2Reducer, counterInitialState);

        Store.createEffect(
            actions$.pipe(
                ofType('counterEffectStart'),
                mergeMap(() => of({ type: 'counterEffectSuccess' }))
            )
        );

        const spy2 = jest.fn().mockImplementation((value) => {
            Store.dispatch({ type: 'counterEffectStart' });
        });

        const counter2$ = Store.select(getCounter2);

        counter2$.pipe(take(callLimit)).subscribe(spy2);

        expect(spy2).toHaveBeenCalledTimes(callLimit);
        expect(spy2).toHaveBeenNthCalledWith(callLimit, callLimit);
    });

    it('should select state from a Feature (which was created with `extends Feature)', () => {
        const counterFeatureState = new CounterFeatureState();
        counterFeatureState.increment();

        const spy = jest.fn();
        Store.select(getCounter3).subscribe(spy);
        expect(spy).toHaveBeenCalledWith(2);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should overwrite reducers default state with a provided initialState', () => {
        const customInitialState: CounterState = {
            counter: 2,
        };

        Store.feature<CounterState>('counter4', counterReducer, customInitialState);

        const spy = jest.fn();
        Store.select((state) => state.counter4).subscribe(spy);
        expect(spy).toHaveBeenCalledWith(customInitialState);
    });

    it('should resubscribe on action stream when side effect error is not handled', () => {
        const spy = jest.fn();

        Store.createEffect(
            actions$.pipe(
                ofType('someAction3'),
                mergeMap(() => {
                    spy();
                    throw new Error();
                })
            )
        );

        Store.dispatch({ type: 'someAction3' });
        Store.dispatch({ type: 'someAction3' });
        Store.dispatch({ type: 'someAction3' });

        expect(spy).toHaveBeenCalledTimes(3);
    });
});

const nextStateSpy = jest.fn();

function aReducer(state: string, action: Action): string {
    switch (action.type) {
        case 'metaTest':
            return state + 'd';
        default:
            return state;
    }
}

function metaReducer1(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        if (action.type === 'metaTest') {
            state = {
                ...state,
                metaTestFeature: state.metaTestFeature + 'b',
            };
        }

        return reducer(state, action);
    };
}

function metaReducer2(reducer: Reducer<any>): Reducer<any> {
    return (state, action) => {
        if (action.type === 'metaTest') {
            state = {
                ...state,
                metaTestFeature: state.metaTestFeature + 'c',
            };
        }

        return reducer(state, action);
    };
}

export function inTheMiddleMetaReducer(oldReducer) {
    return (state, action) => {
        const nextState = oldReducer(state, action);

        nextStateSpy(nextState);

        return nextState;
    };
}

const getMetaTestFeature = createFeatureSelector<string>('metaTestFeature');

describe('Store MetaReducers', () => {
    beforeAll(() => {
        StoreCore.addMetaReducer(metaReducer1);
        StoreCore.addMetaReducer(inTheMiddleMetaReducer);
        StoreCore.addMetaReducer(metaReducer2);
        StoreCore.addFeature<string>('metaTestFeature', 'a', aReducer);
    });
    it('should run meta reducers first, then the normal reducer', () => {
        const spy = jest.fn();
        StoreCore.select(getMetaTestFeature).subscribe(spy);
        StoreCore.dispatch({ type: 'metaTest' });
        expect(spy).toHaveBeenCalledWith('abcd');
    });
    it('should calculate nextState also if nextState is calculated by a metaReducer in the "middle"', () => {
        expect(nextStateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ metaTestFeature: 'a' })
        );
        expect(nextStateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ metaTestFeature: 'abcd' })
        );
    });
});
