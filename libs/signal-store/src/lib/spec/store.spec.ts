import { Store } from '../store';
import {
    Action,
    Actions,
    ActionWithPayload,
    ExtensionId,
    FeatureConfig,
    MetaReducer,
    Reducer,
    StoreConfig,
    StoreExtension,
} from '../models';
import { createFeatureStateSelector, createSelector } from '../signal-selector';
import { BehaviorSubject, Observable, of, withLatestFrom } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { FeatureStore } from '../feature-store';
import { counterInitialState, CounterState, resetStoreConfig } from './_spec-helpers';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '../ng-modules/store.module';
import { actions$, addExtension, addFeature, rxEffect } from '../store-core';
import { ofType } from '../utils';
import { map, mergeMap, tap } from 'rxjs/operators';
import { createRxEffect } from '../create-rx-effect';
import { LoggerExtension } from '../extensions/logger.extension';

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

function fakeApiGet(): Observable<Partial<UserState>> {
    return of(asyncUser);
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
    err: string | undefined;
}

const userInitialState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
    age: 30,
    err: undefined,
};

function userReducer(state: UserState = userInitialState, action: ActionWithPayload): UserState {
    switch (action.type) {
        case 'updateUser':
        case 'loadUserSuccess':
        case 'saveUserSuccess':
            return {
                ...state,
                ...action.payload,
            };
        case 'resetUser':
            return userInitialState;
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

const getUserFeatureState = createFeatureStateSelector<UserState>('user');
const getFirstName = createSelector(getUserFeatureState, (user) => user.firstName);
const getAge = createSelector(getUserFeatureState, (user) => user.age);

const getCounterFeatureState = createFeatureStateSelector<CounterState>('counter');
const getCounter1 = createSelector(getCounterFeatureState, (state) => state.counter);
const getCounter2FeatureState = createFeatureStateSelector<CounterState>('counter2');
const getCounter2 = createSelector(getCounter2FeatureState, (state) => state.counter);

class CounterFeatureState extends FeatureStore<CounterState> {
    constructor() {
        super('counter3', counterInitialState);
    }

    increment() {
        this.update((state) => ({ counter: state.counter + 1 }));
    }
}

const getCounter3FeatureState = createFeatureStateSelector<CounterState>('counter3');
const getCounter3 = createSelector(getCounter3FeatureState, (state) => state.counter);

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
describe('Store Config', () => {
    afterEach(() => {
        resetStoreConfig();
    });

    it('should initialize the store with an empty object', () => {
        setup();
        const selectedState = store.select((state) => state);
        expect(selectedState()).toEqual({});
    });

    it('should dispatch an initial action', () => {
        const spy = jest.fn();
        actions.subscribe(spy);
        setup();
        expect(spy).toHaveBeenCalledWith({ type: '@mini-rx/init' });
    });

    it('should initialize the store with an empty object when root reducers have no initial state', () => {
        setup({
            reducers: {
                test: (state) => {
                    return state;
                },
            },
        });

        const selectedState = store.select((state) => state);
        expect(selectedState()).toEqual({});
    });

    it('should initialize a Feature state with a root reducer', () => {
        setup({
            reducers: { user: userReducer },
        });

        const selectedState = store.select((state) => state);
        expect(selectedState()).toEqual({
            user: userInitialState,
        });
    });

    it('should initialize the store with root initial state', () => {
        const rootInitialState = {
            user: { name: 'Nicolas' },
        };

        setup({
            initialState: rootInitialState,
            reducers: {
                user: userReducer,
                user2: userReducer,
            },
        });

        const spy = jest.fn();
        const selectedState = store.select((state) => state);

        expect(selectedState()).toEqual({
            user: { name: 'Nicolas' }, // userReducer initial state is overwritten by the root initial state
            user2: userInitialState, // Root initial state does not affect User2 initial state
        });
    });

    // TODO what happens if StoreModule forRoot is called many times
    //     it('should throw when calling Store.config after a Feature Store was initialized', () => {
    //         createFeatureStore('tooEarlyInstantiatedFeatureStore', {});
    //         expect(() => StoreCore.configureStore({})).toThrowError(
    //             '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
    //         );
    //     });

    describe('Root Meta Reducers', () => {
        const nextStateSpy = jest.fn();

        it('should call root meta reducer with root initial state', () => {
            const rootMetaReducerSpy = jest.fn();
            const rootInitialState = {
                user: {},
            };

            function rootMetaReducer1(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    rootMetaReducerSpy(state);
                    return reducer(state, action);
                };
            }

            setup({
                metaReducers: [rootMetaReducer1],
                initialState: rootInitialState,
            });

            expect(rootMetaReducerSpy).toHaveBeenCalledWith(rootInitialState);
        });

        it('should call root meta reducers from left to right', () => {
            const callOrder: string[] = [];

            function rootMetaReducer1(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    callOrder.push('meta1');
                    return reducer(state, action);
                };
            }

            function rootMetaReducer2(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    callOrder.push('meta2');
                    return reducer(state, action);
                };
            }

            setup({
                metaReducers: [rootMetaReducer1, rootMetaReducer2],
            });

            expect(callOrder).toEqual(['meta1', 'meta2']);
        });

        it('should call root meta reducers from extensions depending on sortOrder', () => {
            const callOrder: string[] = [];

            function rootMetaReducerForExtension(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    callOrder.push('meta1');
                    return reducer(state, action);
                };
            }

            class Extension extends StoreExtension {
                id = ExtensionId.LOGGER; // id does not matter, but it has to be implemented
                override sortOrder = 3;

                init(): MetaReducer<any> {
                    return rootMetaReducerForExtension;
                }
            }

            function rootMetaReducerForExtension2(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    callOrder.push('meta2');
                    return reducer(state, action);
                };
            }

            class Extension2 extends StoreExtension {
                id = ExtensionId.LOGGER; // id does not matter, but it has to be implemented
                override sortOrder = 2;

                init(): MetaReducer<any> {
                    return rootMetaReducerForExtension2;
                }
            }

            function rootMetaReducerForExtension3(reducer: Reducer<any>): Reducer<any> {
                return (state, action) => {
                    callOrder.push('meta3');
                    return reducer(state, action);
                };
            }

            class Extension3 extends StoreExtension {
                id = ExtensionId.LOGGER; // id does not matter, but it has to be implemented
                override sortOrder = 1;

                init(): MetaReducer<any> {
                    return rootMetaReducerForExtension3;
                }
            }

            setup({
                extensions: [new Extension(), new Extension2(), new Extension3()],
            });

            expect(callOrder).toEqual(['meta3', 'meta2', 'meta1']);
        });

        it(
            'should run reducers in order: ' +
                '1.) root meta reducers ' +
                '2.) root meta reducers from extensions' +
                '3.) feature meta reducers, ' +
                '4.) feature reducer',
            () => {
                function rootMetaReducerForExtension(reducer: Reducer<any>): Reducer<any> {
                    return (state, action) => {
                        if (action.type === 'metaTest') {
                            state = {
                                ...state,
                                metaTestFeature: state.metaTestFeature + 'x',
                            };
                        }

                        return reducer(state, action);
                    };
                }

                class Extension extends StoreExtension {
                    id = ExtensionId.LOGGER; // id does not matter, but it has to be implemented

                    init(): MetaReducer<any> {
                        return rootMetaReducerForExtension;
                    }
                }

                function aFeatureReducer(state = 'a', action: Action): string {
                    switch (action.type) {
                        case 'metaTest':
                            return state + 'e';
                        default:
                            return state;
                    }
                }

                function rootMetaReducer1(reducer: Reducer<any>): Reducer<any> {
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

                function rootMetaReducer2(reducer: Reducer<any>): Reducer<any> {
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

                function inTheMiddleRootMetaReducer(reducer: Reducer<any>): Reducer<any> {
                    return (state, action) => {
                        const nextState = reducer(state, action);

                        nextStateSpy(nextState);

                        return reducer(state, action);
                    };
                }

                function featureMetaReducer(reducer: Reducer<string>): Reducer<string> {
                    return (state, action) => {
                        if (action.type === 'metaTest') {
                            state = state + 'd';
                        }

                        return reducer(state, action);
                    };
                }

                const getMetaTestFeature = createFeatureStateSelector<string>('metaTestFeature');

                setup(
                    {
                        metaReducers: [
                            rootMetaReducer1,
                            inTheMiddleRootMetaReducer,
                            rootMetaReducer2,
                        ],
                        extensions: [new Extension()],
                    },
                    {
                        key: 'metaTestFeature',
                        reducer: aFeatureReducer,
                        config: {
                            metaReducers: [featureMetaReducer],
                        },
                    }
                );

                const selectedState = store.select(getMetaTestFeature);
                store.dispatch({ type: 'metaTest' });
                expect(selectedState()).toEqual('abcxde');
            }
        );

        it('should calculate nextState also if nextState is calculated by a metaReducer in the "middle"', () => {
            expect(nextStateSpy).toHaveBeenCalledWith(
                expect.objectContaining({ metaTestFeature: 'abcxde' })
            );
            expect(nextStateSpy).toHaveBeenCalledWith(
                expect.objectContaining({ metaTestFeature: 'abcxde' })
            );
        });
    });

    describe('Store', () => {
        afterEach(() => {
            resetStoreConfig();
        });

        it('should run the redux reducers when a new Feature state is added', () => {
            const reducerSpy = jest.fn();

            function someReducer() {
                reducerSpy();
            }

            setup(
                { reducers: { user: userReducer } },
                { key: 'oneMoreFeature', reducer: someReducer }
            );

            expect(reducerSpy).toHaveBeenCalledTimes(1);
        });

        it('should throw when reusing feature name', () => {
            expect(() => {
                TestBed.configureTestingModule({
                    imports: [
                        StoreModule.forRoot({}),
                        StoreModule.forFeature('alreadyExistingFeature', userReducer),
                    ],
                });

                TestBed.configureTestingModule({
                    imports: [StoreModule.forFeature('alreadyExistingFeature', userReducer)],
                });

                const store = TestBed.inject(Store); // inject Store to execute TestBed
            }).toThrowError('@mini-rx: Feature "alreadyExistingFeature" already exists.');
        });

        it('should dispatch an initial action when adding a feature', () => {
            const spy = jest.fn();
            actions.subscribe(spy);

            addFeature('oneMoreFeature3', (state) => state);

            expect(spy).toHaveBeenCalledWith({ type: '@mini-rx/oneMoreFeature3/init' });
        });

        it('should update the Feature state', () => {
            setup({ reducers: { user: userReducer } });

            const user = {
                firstName: 'Nicolas',
                lastName: 'Cage',
            };

            store.dispatch({
                type: 'updateUser',
                payload: user,
            });

            const firstName = store.select(getFirstName);
            expect(firstName()).toEqual(user.firstName);
        });

        it('should update the Feature state', () => {
            setup({ reducers: { user: userReducer } });

            const age = store.select(getAge);
            expect(age()).toBe(30);

            store.dispatch({ type: 'incAge' });
            expect(age()).toBe(31);
        });

        it('should return undefined if feature does not exist yet', () => {
            const featureSelector = createFeatureStateSelector('notExistingFeature');
            const selectedState = store.select(featureSelector);
            expect(selectedState()).toBe(undefined);
        });

        xit('bla', () => {
            setup({ reducers: { user: userReducer } });

            const selectedState = store.select(getUserFeatureState);

            const test$ = new BehaviorSubject(5);

            const statePerAction$ = actions.pipe(map(() => 1));

            statePerAction$.subscribe(console.log);

            store.dispatch({ type: 'resetUser' });

            expect(actions).toBeObservable(
                // hot('a-xb', { a: userInitialState, b: asyncUser, x: updatedAsyncUser })
                hot('a', { a: userInitialState })
            );
        });

        xit('should create and execute an effect', () => {
            setup({ reducers: { user: userReducer } });

            const selectedState = store.select(getUserFeatureState);

            const statePerAction$ = actions.pipe(map(() => selectedState()));

            store.dispatch({ type: 'resetUser' });

            // expect(selectedState()).toEqual(userInitialState);

            store.rxEffect(
                actions.pipe(
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

            store.dispatch({ type: 'loadUser' });

            expect(selectedState()).toEqual(asyncUser);

            // Let's be crazy and add another effect while the other effect is busy
            // cold('-a').subscribe(() => {
            //     const effect = createRxEffect(
            //         actions.pipe(
            //             ofType('saveUser'),
            //             mergeMap(() =>
            //                 fakeApiUpdate().pipe(
            //                     map((user) => ({
            //                         type: 'saveUserSuccess',
            //                         payload: user,
            //                     }))
            //                 )
            //             )
            //         )
            //     );
            //
            //     store.rxEffect(effect);
            //
            //     store.dispatch({ type: 'saveUser' });
            // });

            expect(statePerAction$).toBeObservable(
                // hot('a-xb', { a: userInitialState, b: asyncUser, x: updatedAsyncUser })
                hot('a', { a: userInitialState })
            );
        });

        it('should create and execute a non-dispatching effect', () => {
            const action1 = { type: 'someAction' };
            const action2 = { type: 'someAction2' };

            const effect = createRxEffect(
                actions.pipe(
                    ofType(action1.type),
                    mergeMap(() => of(action2))
                ),
                { dispatch: false }
            );

            rxEffect(effect);

            const spy = jest.fn();
            actions.subscribe(spy);

            store.dispatch(action1);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(action1);
            expect(spy).not.toHaveBeenCalledWith(action2);
        });

        //
        //     it('should create and execute an effect and handle side effect error', () => {
        //         store.dispatch({ type: 'resetUser' });
        //
        //         store.effect(
        //             actions$.pipe(
        //                 ofType('someAction'),
        //                 mergeMap(() =>
        //                     fakeApiWithError().pipe(
        //                         map(() => ({
        //                             type: 'whatever',
        //                         })),
        //                         catchError(() => of({ type: 'error', payload: 'error' }))
        //                     )
        //                 )
        //             )
        //         );
        //
        //         store.dispatch({ type: 'someAction' });
        //
        //         expect(store.select(getUserFeatureState)).toBeObservable(
        //             hot('ab', { a: userInitialState, b: { ...userInitialState, err: 'error' } })
        //         );
        //     });
        //
        // TODO is this a good test? Log is tested in LoggerExtension spec?
        it('should log', () => {
            setup({ reducers: { user: userReducer } });

            console.log = jest.fn(); // TODO restore log?

            const user: UserState = {
                firstName: 'John',
                lastName: 'Travolta',
                age: 35,
                err: undefined,
            };

            const newState = {
                user,
            };

            const action: Action = {
                type: 'updateUser',
                payload: user,
            };

            addExtension(new LoggerExtension());

            store.dispatch(action);

            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('%cupdateUser'),
                expect.stringContaining('color: #25c2a0'),
                expect.stringContaining('Action:'),
                action,
                expect.stringContaining('State: '),
                newState
            );
        });

        it('should call the reducer before running the effect', () => {
            const callOrder: string[] = [];
            const someReducer = (state = { value: 0 }, action: Action) => {
                switch (action.type) {
                    case 'someAction2':
                        callOrder.push('reducer');
                        return {
                            ...state,
                            value: state.value + 1,
                        };
                    default:
                        return state;
                }
            };

            setup({
                reducers: {
                    someFeature: someReducer,
                },
            });

            actions.subscribe(console.log);

            const onEffectStarted = (): Observable<Action> => {
                callOrder.push('effect');
                return of({ type: 'whatever' });
            };

            const valueSpy = jest.fn();

            rxEffect(
                actions.pipe(
                    ofType('someAction2'),
                    mergeMap(() => {
                        const selectedState = store.select((state) => state['someFeature'].value);
                        valueSpy(selectedState());
                        return onEffectStarted();
                    })
                )
            );

            store.dispatch({ type: 'someAction2' });

            expect(callOrder).toEqual(['reducer', 'effect']);
            expect(valueSpy).toHaveBeenCalledWith(1); // Effect can select the updated state immediately
        });
    });
    //
    //     it('should queue actions', () => {
    //         const callLimit = 5000;
    //
    //         store.feature<CounterState>('counter', counterReducer);
    //
    //         const spy = jest.fn().mockImplementation(() => {
    //             store.dispatch({ type: 'counter' });
    //         });
    //
    //         const counter1$ = store.select(getCounter1);
    //
    //         counter1$.pipe(take(callLimit)).subscribe(spy);
    //
    //         expect(spy).toHaveBeenCalledTimes(callLimit);
    //         expect(spy).toHaveBeenNthCalledWith(callLimit, callLimit);
    //     });
    //
    //     it('should queue effect actions', () => {
    //         const callLimit = 5000;
    //
    //         function counter2Reducer(state: CounterState = counterInitialState, action: Action) {
    //             switch (action.type) {
    //                 case 'counterEffectSuccess':
    //                     return {
    //                         ...state,
    //                         counter: state.counter + 1,
    //                     };
    //                 default:
    //                     return state;
    //             }
    //         }
    //
    //         store.feature<CounterState>('counter2', counter2Reducer);
    //
    //         store.effect(
    //             actions$.pipe(
    //                 ofType('counterEffectStart'),
    //                 mergeMap(() => of({ type: 'counterEffectSuccess' }))
    //             )
    //         );
    //
    //         const spy2 = jest.fn().mockImplementation(() => {
    //             store.dispatch({ type: 'counterEffectStart' });
    //         });
    //
    //         const counter2$ = store.select(getCounter2);
    //
    //         counter2$.pipe(take(callLimit)).subscribe(spy2);
    //
    //         expect(spy2).toHaveBeenCalledTimes(callLimit);
    //         expect(spy2).toHaveBeenNthCalledWith(callLimit, callLimit);
    //     });
    //
    //     it('should select state from a Feature (which was created with `extends Feature)', () => {
    //         const counterFeatureState = new CounterFeatureState();
    //         counterFeatureState.increment();
    //
    //         const spy = jest.fn();
    //         store.select(getCounter3).subscribe(spy);
    //         expect(spy).toHaveBeenCalledWith(2);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //     });
    //
    //     it('should overwrite reducers default state with a provided initialState', () => {
    //         const featureKey = 'counterWithCustomInitialState';
    //         const customInitialState: CounterState = {
    //             counter: 2,
    //         };
    //
    //         store.feature<CounterState>(featureKey, counterReducer, {
    //             initialState: customInitialState,
    //         });
    //
    //         const spy = jest.fn();
    //         store.select((state) => state[featureKey]).subscribe(spy);
    //         expect(spy).toHaveBeenCalledWith(customInitialState);
    //     });
    //
    //     it('should resubscribe the effect 10 times (if side effect error is not handled)', () => {
    //         const spy = jest.fn();
    //         console.error = jest.fn();
    //
    //         function apiCallWithError() {
    //             spy();
    //             throw new Error();
    //             return of('someValue');
    //         }
    //
    //         store.effect(
    //             actions$.pipe(
    //                 ofType('someAction3'),
    //                 mergeMap(() => {
    //                     return apiCallWithError().pipe(mapTo({ type: 'someActionSuccess' }));
    //                 })
    //             )
    //         );
    //
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' });
    //         store.dispatch({ type: 'someAction3' }); // #12 will not trigger the Api call anymore
    //         store.dispatch({ type: 'someAction3' }); // #13 will not trigger the Api call anymore
    //
    //         expect(spy).toHaveBeenCalledTimes(11); // Api call is performed 11 Times. First time + 10 re-subscriptions
    //
    //         function getErrorMsg(times: number) {
    //             return `@mini-rx: An error occurred in the Effect. MiniRx resubscribed the Effect automatically and will do so ${times} more times.`;
    //         }
    //
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(9)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(8)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(7)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(6)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(5)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(4)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(3)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(2)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(1)),
    //             expect.any(Error)
    //         );
    //         expect(console.error).toHaveBeenCalledWith(
    //             expect.stringContaining(getErrorMsg(0)),
    //             expect.any(Error)
    //         );
    //
    //         expect(console.error).toHaveBeenCalledTimes(10); // Re-subscription with error logging stopped after 10 times
    //     });
    //
    //     it('should throw when creating store again with functional creation method', () => {
    //         expect(() => configureStore({})).toThrow();
    //     });
    //
    //     it('should not emit a new AppState when dispatching unknown Actions', () => {
    //         const spy = jest.fn();
    //         store.select((state) => state).subscribe(spy);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         spy.mockReset();
    //
    //         store.dispatch({ type: 'unknownAction' });
    //         expect(spy).toHaveBeenCalledTimes(0);
    //     });
    //
    //     it('should add and remove reducers', () => {
    //         const featureKey = 'tempCounter';
    //
    //         const spy = jest.fn();
    //         StoreCore.addFeature<CounterState>(featureKey, counterReducer);
    //         store.select((state) => state).subscribe(spy);
    //         expect(spy).toHaveBeenCalledWith(
    //             expect.objectContaining({ tempCounter: counterInitialState })
    //         );
    //
    //         StoreCore.removeFeature(featureKey);
    //         expect(spy).toHaveBeenCalledWith(
    //             expect.not.objectContaining({ tempCounter: counterInitialState })
    //         );
    //     });
    // });
    //
    // describe('Store Feature MetaReducers', () => {
    //     const getMetaTestFeature = createFeatureStateSelector<CounterStringState>('metaTestFeature2');
    //     const getCount = createSelector(getMetaTestFeature, (state) => state.count);
    //
    //     interface CounterStringState {
    //         count: string;
    //     }
    //
    //     function aFeatureReducer(
    //         state: CounterStringState = { count: '0' },
    //         action: Action
    //     ): CounterStringState {
    //         switch (action.type) {
    //             case 'metaTest2':
    //                 return {
    //                     ...state,
    //                     count: state.count + '3',
    //                 };
    //             default:
    //                 return state;
    //         }
    //     }
    //
    //     function featureMetaReducer1(reducer: Reducer<any>): Reducer<CounterStringState> {
    //         return (state, action: Action) => {
    //             if (action.type === 'metaTest2') {
    //                 state = {
    //                     ...state,
    //                     count: state.count + '1',
    //                 };
    //             }
    //
    //             return reducer(state, action);
    //         };
    //     }
    //
    //     function featureMetaReducer2(reducer: Reducer<any>): Reducer<CounterStringState> {
    //         return (state, action: Action) => {
    //             if (action.type === 'metaTest2') {
    //                 state = {
    //                     ...state,
    //                     count: state.count + '2',
    //                 };
    //             }
    //
    //             return reducer(state, action);
    //         };
    //     }
    //
    //     const nextStateSpy = jest.fn();
    //
    //     function inTheMiddleMetaReducer(reducer: Reducer<any>): Reducer<any> {
    //         return (state, action) => {
    //             const nextState = reducer(state, action);
    //
    //             nextStateSpy(nextState);
    //
    //             return reducer(state, action);
    //         };
    //     }
    //
    //     it('should run meta reducers first, then the normal reducer', () => {
    //         StoreCore.addFeature<CounterStringState>('metaTestFeature2', aFeatureReducer, {
    //             metaReducers: [featureMetaReducer1, inTheMiddleMetaReducer, featureMetaReducer2],
    //         });
    //
    //         const spy = jest.fn();
    //         StoreCore.appState.select(getCount).subscribe(spy);
    //         StoreCore.dispatch({ type: 'metaTest2' });
    //         expect(spy).toHaveBeenCalledWith('0');
    //         expect(spy).toHaveBeenCalledWith('0123');
    //     });
    //
    //     it('should calculate nextState also if nextState is calculated by a metaReducer in the "middle"', () => {
    //         expect(nextStateSpy).toHaveBeenCalledWith({ count: '0' });
    //         expect(nextStateSpy).toHaveBeenCalledWith({ count: '0123' });
    //         expect(nextStateSpy).toHaveBeenCalledTimes(2);
    //     });
});
