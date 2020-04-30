import Store, { actions$ } from './store';
import StoreCore from './store-core';
import { Action, Settings } from './interfaces';
import { createFeatureSelector, createSelector } from './selector';
import { EMPTY, Observable, of } from 'rxjs';
import { ofType } from './utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReduxDevtoolsExtension } from './redux-devtools/redux-devtools.extension';

const asyncUser: UserState = {
    firstName: 'Steven',
    lastName: 'Seagal',
};

export function getAsyncUser(): Observable<UserState> {
    return of(asyncUser);
}

function reducer(state: UserState, action: Action): any {
    switch (action.type) {
        case 'updateUser':
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
}

interface UserState {
    firstName: string;
    lastName: string;
}

const initialState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
};

const getUser = createFeatureSelector<UserState>('user');
const getFirstName = createSelector(getUser, (user) => user.firstName);

describe('Store', () => {
    it('should initialize the store', () => {
        const spy = jest.fn();
        Store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({});
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should initialize a Feature state', () => {
        Store.feature<UserState>('user', initialState, reducer);

        const spy = jest.fn();
        Store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({
            user: initialState,
        });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw when reusing feature name', () => {
        expect(() =>
            Store.feature<UserState>('user', initialState, reducer)
        ).toThrowError();
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
        expect(spy).toHaveBeenCalledWith('Nicolas');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should create and execute an effect', () => {
        Store.createEffect(
            actions$.pipe(
                ofType('loadUser'),
                mergeMap(() =>
                    getAsyncUser().pipe(
                        map((user) => ({
                            type: 'updateUser',
                            payload: user,
                        })),
                        catchError((err) => EMPTY)
                    )
                )
            )
        );

        Store.dispatch({ type: 'loadUser' });

        const spy = jest.fn();
        Store.select(getUser).subscribe(spy);

        expect(spy).toHaveBeenCalledWith(asyncUser);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should set the settings', () => {
        const settings: Settings = { enableLogging: true };
        Store.settings = settings;
        expect(StoreCore.settings).toEqual(settings);
    });

    it('should warn if settings are set again', () => {
        console.warn = jest.fn();

        const settings: Settings = { enableLogging: true };
        Store.settings = settings;
        expect(console.warn).toHaveBeenCalledWith(
            'MiniRx: Settings are already set.'
        );
    });

    it('should log', () => {
        console.log = jest.fn();

        const user = {
            firstName: 'John',
            lastName: 'Travolta',
        };

        const newState = {
            user,
        };

        const settings: Settings = { enableLogging: true };
        Store.settings = settings;
        expect(StoreCore.settings).toEqual(settings);

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
        expect(StoreCore['extensions'].length).toBe(1);
    });
});
