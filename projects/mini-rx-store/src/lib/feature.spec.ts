import { Feature } from './feature';
import { getAsyncUser, initialState, UserState } from './store.spec';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

class FeatureState extends Feature<UserState> {
    $firstName = this.select((state) => state.firstName);
    $lastName = this.select((state) => state.lastName);

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
        userFeature.$firstName.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Bruce');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update state', () => {
        userFeature.updateFirstName('Nicolas');
        const spy = jest.fn();
        userFeature.$firstName.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Nicolas');
        expect(spy).toHaveBeenCalledTimes(1);

        userFeature.updateLastName('Cage');
        userFeature.$lastName.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Cage');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should create and execute an effect', () => {
        userFeature.loadFn();
        const spy = jest.fn();
        userFeature.$firstName.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('Steven');
    });
});
