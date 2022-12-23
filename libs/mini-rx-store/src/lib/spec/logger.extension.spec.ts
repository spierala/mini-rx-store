import { counterReducer, resetStoreConfig, userState } from './_spec-helpers';
import { LoggerExtension } from '../extensions/logger.extension';
import { createFeatureStore } from '../feature-store';
import { getStoreCore } from '../store-core';

const StoreCore = getStoreCore();

describe('LoggerExtension', () => {
    console.log = jest.fn();

    beforeEach(() => {
        resetStoreConfig();

        StoreCore.config({
            extensions: [new LoggerExtension()],
        });
    });

    it('should log a dispatched Action', () => {
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
        const fs = createFeatureStore('user', userState);

        fs.setState((state) => ({
            firstName: 'Cage',
        }));

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('@mini-rx/user/set-state'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            {
                type: '@mini-rx/user/set-state',
                payload: {
                    firstName: 'Cage',
                },
            },
            expect.stringContaining('State: '),
            {
                user: {
                    ...userState,
                    firstName: 'Cage',
                },
            }
        );
    });
});
