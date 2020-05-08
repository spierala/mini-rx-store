import { Feature } from '../feature';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { createFeatureSelector, createSelector } from '../selector';
import { cold, hot } from 'jest-marbles';
import { actions$ } from '../store';

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
    err: undefined
};

const asyncUser: UserState = {
    firstName: 'Steven',
    lastName: 'Seagal',
    city: 'LA',
    country: 'United States',
    err: ''
};

function fakeApiGet(): Observable<UserState> {
    return cold('---a', {a: asyncUser});
}

function fakeApiWithError(): Observable<UserState> {
    return cold('-#');
}

const getUserFeatureState = createFeatureSelector<UserState>('user2'); // Select From App State
const getCity = createSelector(getUserFeatureState, (state) => state.city);

const getUserFeatureState2 = createFeatureSelector<UserState>(); // Select Feature State by omitting the Feature name
const getCountry = createSelector(
    getUserFeatureState2,
    (state) => state.country
);

class FeatureState extends Feature<UserState> {
    state$ = this.state$;
    firstName$ = this.select((state) => state.firstName);
    lastName$ = this.select((state) => state.lastName);
    city$ = this.select(getCity, true);
    country$ = this.select(getCountry);

    loadFn = this.createEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiGet().pipe(
                    map((user) => user)
                )
            )
        ), 'load'
    );

    loadFnWithoutName = this.createEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiGet().pipe(
                    map((user) => user)
                )
            )
        )
    );

    loadFnWithoutName2 = this.createEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiGet().pipe(
                    map((user) => user)
                )
            )
        )
    );

    loadFnWithError = this.createEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                fakeApiWithError().pipe(
                    map((user) => user),
                    catchError((err) => of({err: 'error'}))
                )
            )
        )
    );

    constructor() {
        super('user2', initialState);
    }

    updateFirstName(firstName) {
        this.setState((state) => ({ firstName }));
    }

    updateLastName(lastName) {
        this.setState({ lastName });
    }

    updateCity(city) {
        this.setState({ city }, 'updateCity');
    }

    resetState() {
        this.setState(initialState);
    }
}

let userFeature: FeatureState;

describe('Feature', () => {
    it('should initialize the feature', () => {
        userFeature = new FeatureState();
        const spy = jest.fn();
        userFeature.firstName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Bruce');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state', () => {
        userFeature.updateFirstName('Nicolas');
        const spy = jest.fn();
        userFeature.firstName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Nicolas');
        expect(spy).toHaveBeenCalledTimes(1);

        userFeature.updateLastName('Cage');
        userFeature.lastName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Cage');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should select state from store (App State)', () => {
        const spy = jest.fn();
        userFeature.city$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('LA');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should select state from feature (Feature State)', () => {
        const spy = jest.fn();
        userFeature.country$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('United States');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should create and execute an effect', () => {
        userFeature.loadFn();
        expect(userFeature.firstName$).toBeObservable(hot('a--b', {a: 'Nicolas', b: 'Steven'}));
    });

    it('should create and execute an effect and handle error', () => {
        userFeature.resetState();
        userFeature.loadFnWithError();
        expect(userFeature.state$).toBeObservable(hot('ab', {a: initialState, b: {...initialState, err: 'error'}}));
    });

    it('should append setState name to action type', () => {
        userFeature.resetState();

        const spy = jest.fn();
        actions$.subscribe(spy);
        userFeature.updateCity('NY');
        expect(spy).toHaveBeenCalledWith({type: '@mini-rx/user2/set-state/updateCity', payload: {...initialState, city: 'NY'}});
    });

    it('should append effect name to action type', () => {
        hot('a').subscribe(
            () => userFeature.loadFn()
        );

        expect(actions$).toBeObservable(hot('a--b', {
            a: {type: '@mini-rx/user2/effect/load', payload: undefined},
            b: {type: '@mini-rx/user2/effect/load/set-state', payload: asyncUser},
        }));
    });

    it('should append default effect name to action type', () => {
        hot('a').subscribe(
            () => userFeature.loadFnWithoutName()
        );

        expect(actions$).toBeObservable(hot('a--b', {
            a: {type: '@mini-rx/user2/effect/1', payload: undefined},
            b: {type: '@mini-rx/user2/effect/1/set-state', payload: asyncUser},
        }));
    });

    it('should increment and append default effect name to action type', () => {
        hot('a').subscribe(
            () => userFeature.loadFnWithoutName2()
        );

        expect(actions$).toBeObservable(hot('a--b', {
            a: {type: '@mini-rx/user2/effect/2', payload: undefined},
            b: {type: '@mini-rx/user2/effect/2/set-state', payload: asyncUser},
        }));
    });
});
