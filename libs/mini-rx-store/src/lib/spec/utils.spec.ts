import { ofType } from '../utils';
import { Action } from '../models';
import { store } from './_spec-helpers';
import { actions$ } from '../store-core';

const action1: Action = {
    type: 'updateUser',
};

const action2: Action = {
    type: 'updateProduct',
};

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
