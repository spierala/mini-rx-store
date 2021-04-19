import { actions$ } from '../store';
import { combineReducers, createFeatureReducer, ofType } from '../utils';
import { Action, AppState, Reducer } from '../models';
import { store } from './_spec-helpers';

const action1: Action = {
    type: 'updateUser',
};

const action2: Action = {
    type: 'updateProduct',
};

const action3: Action = {
    type: 'showProductCode',
};

const action4: Action = {
    type: 'showProductCode2',
};

function reducer(state: any, action: Action): any {
    switch (action.type) {
        case action3.type:
            return {
                ...state,
                showProductCode: true,
            };
        default:
            return state;
    }
}

function reducer2(state: any, action: Action): any {
    switch (action.type) {
        case action4.type:
            return {
                ...state,
                showProductCode2: false,
            };
        default:
            return state;
    }
}

describe('ofType', () => {
    it('should filter by action type', () => {
        const spy = jest.fn();
        actions$.pipe(ofType('someType')).subscribe(spy);

        store.dispatch(action1);

        expect(spy).toHaveBeenCalledTimes(0);

        const spy2 = jest.fn();
        actions$.pipe(ofType(action1.type)).subscribe(spy2);

        store.dispatch(action1);

        expect(spy2).toHaveBeenCalledWith(action1);
        expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('should allow many types', () => {
        const spy = jest.fn();
        actions$.pipe(ofType('someType', action1.type, action2.type)).subscribe(spy);

        store.dispatch(action1);
        store.dispatch(action2);

        expect(spy).toHaveBeenCalledTimes(2);
    });
});

describe('combine Reducers', () => {
    let combinedReducer: Reducer<AppState>;

    it('should combine reducers', () => {
        const featureName1 = 'feature1';
        const featureName2 = 'feature2';

        combinedReducer = combineReducers(new Map([[featureName1, createFeatureReducer(featureName1, reducer)], [featureName2, createFeatureReducer(featureName2, reducer2)]]));

        const newState = combinedReducer({}, action3);
        expect(newState).toEqual({ feature1: {showProductCode: true }});

        const newState2 = combinedReducer(newState, action4);
        expect(newState2).toEqual({
            feature1: {showProductCode: true },
            feature2: {showProductCode2: false }
        });
    });

    it('should remove keys from state which are not present in the reducer map', () => {
        const newState = combinedReducer({
            feature1: {showProductCode: true },
            feature2: {showProductCode2: false },
            feature3: {showProductCode2: false }
        }, action4);

        expect(newState).toEqual({
            feature1: {showProductCode: true },
            feature2: {showProductCode2: false }
        });
    });
});
