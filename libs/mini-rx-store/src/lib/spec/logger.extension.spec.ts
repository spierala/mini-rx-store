import { counterReducer, resetStoreConfig } from './_spec-helpers';
import { createFeatureStore, LoggerExtension } from 'mini-rx-store';
import StoreCore from '../store-core';

interface UserState {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    err: string | undefined;
}

const initialState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
    city: 'LA',
    country: 'United States',
    err: undefined,
};

describe('LoggerExtension', () => {
    beforeEach(() => {
        resetStoreConfig();

        StoreCore.config({
            extensions: [new LoggerExtension()],
        });
    });

    it('should log a dispatched Action', () => {
        console.log = jest.fn();

        StoreCore.addFeature('counter', counterReducer);

        const action = { type: 'counter' };

        StoreCore.dispatch(action);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('counter'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            action,
            expect.stringContaining('State: '),
            { counter: { counter: 2 } }
        );
    });

    it('should log a SetStateAction with only type and payload', () => {
        const fs = createFeatureStore('user', initialState);

        console.log = jest.fn();

        fs.setState((state) => ({
            firstName: 'Cage',
        }));

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('@mini-rx/set-state/user'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            {
                type: '@mini-rx/set-state/user',
                payload: {
                    firstName: 'Cage',
                },
            },
            expect.stringContaining('State: '),
            {
                user: {
                    ...initialState,
                    firstName: 'Cage',
                },
            }
        );
    });
});
