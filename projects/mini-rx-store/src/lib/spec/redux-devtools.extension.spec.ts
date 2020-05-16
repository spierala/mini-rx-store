import Store from '../store';
import StoreCore from '../store-core';
import { ReduxDevtoolsExtension, ReduxDevtoolsOptions } from '../redux-devtools.extension';
import { Action } from '../interfaces';
import { counterInitialState, counterReducer, CounterState } from './_spec-helpers';

const win = window as any;
JSON.parse = jest.fn().mockImplementationOnce((data) => {
    return data;
});

let extension: ReduxDevtoolsExtension;
const stateFromReduxDevTools = {
    someProp: 'someValue'
};
const action: Action = {type: 'counter'};
const sendFn = jest.fn();
const subscribeFn = jest.fn();
const connectFn = jest.fn().mockImplementation(() => {
    return {
        subscribe: subscribeFn,
        send: sendFn
    };
});

describe('Redux Dev Tools', () => {
    beforeAll(() => {
        Store.feature<CounterState>('devToolsCounter',  counterInitialState, counterReducer);
    });
    it('should connect to Store', () => {
        const options: Partial<ReduxDevtoolsOptions> = {
            name: 'test',
            maxAge: 50,
            latency: 1000
        };

        win.__REDUX_DEVTOOLS_EXTENSION__ = {
            connect: connectFn
        };

        extension = new ReduxDevtoolsExtension(options);
        Store.addExtension(extension);

        expect(connectFn).toHaveBeenCalledTimes(1);
        expect(connectFn).toHaveBeenCalledWith(options);
        expect(subscribeFn).toHaveBeenCalledTimes(1);
    });

    it('should receive state and actions', () => {
        Store.dispatch(action);
        let currAppState;
        Store.select(state => state).subscribe(state => currAppState = state);

        expect(sendFn).toHaveBeenCalledTimes(1);
        expect(sendFn).toHaveBeenCalledWith(action, {
            ...currAppState,
            devToolsCounter: {counter: 2}
        });
    });

    it('should update the Store state', () => {
        const spy = jest.spyOn(StoreCore, 'updateState');

        extension['onDevToolsMessage']({
            type: 'DISPATCH',
            payload: {
                type: 'JUMP_TO_STATE'
            },
            state: stateFromReduxDevTools
        });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(stateFromReduxDevTools);

        spy.mockReset();

        extension['onDevToolsMessage']({
            type: 'NOT_SUPPORTED_TYPE'
        });

        expect(spy).toHaveBeenCalledTimes(0);
    });
});
