import { Feature } from './feature';
import { getAsyncUser } from './store.spec';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { createFeatureSelector, createSelector } from './selector';

interface UserState { // move to shared spec
    firstName: string;
    lastName: string;
    city: string;
}

const initialState: UserState = { // move to shared spec
    firstName: 'Bruce',
    lastName: 'Willis',
    city: 'LA'
};

const getUserFeatureState = createFeatureSelector<UserState>('user2');
const getCity = createSelector(getUserFeatureState, state => state.city);

class FeatureState extends Feature<UserState> {
    firstName$ = this.select((state) => state.firstName);
    lastName$ = this.select((state) => state.lastName);
    city$ = this.select(getCity, true);

    loadFn = this.createEffect((payload$) =>
        payload$.pipe(
            mergeMap(() =>
                getAsyncUser().pipe(
                    map((user) => user),
                    catchError((err) => EMPTY)
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

    it('should create and execute an effect', () => {
        userFeature.loadFn();
        const spy = jest.fn();
        userFeature.firstName$.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Steven');
    });
});
