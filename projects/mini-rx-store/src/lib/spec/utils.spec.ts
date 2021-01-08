import { actions$, store } from '../store';
import { combineReducers, ofType } from '../utils';
import { Action } from '../models';

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

const action5: Action = {
    type: 'showProductCode3',
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

function reducer3(state: any, action: Action): any {
    switch (action.type) {
        case action4.type:
            return {
                ...state,
                showProductCode3: undefined,
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
    it('should combine reducers', () => {
        const combinedReducer = combineReducers([reducer, reducer2]);

        const newState = combinedReducer({}, action3);
        expect(newState).toEqual({ showProductCode: true });

        const newState2 = combinedReducer(newState, action4);
        expect(newState2).toEqual({ showProductCode: true, showProductCode2: false });

        const combinedReducer2 = combineReducers([combinedReducer, reducer3]);
        const newState3 = combinedReducer2(newState2, action5);
        expect(newState3).toEqual({
            showProductCode: true,
            showProductCode2: false,
            showProductCode3: undefined,
        });
    });
});
