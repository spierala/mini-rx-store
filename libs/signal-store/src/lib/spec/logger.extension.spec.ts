import { counterReducer, resetStoreConfig, userState } from './_spec-helpers';
import { LoggerExtension } from '../extensions/logger.extension';
import { createFeatureStore } from '../feature-store';
import { addFeature, configureStore, dispatch } from '../store-core';
import { createComponentStore } from '../component-store';

describe('LoggerExtension', () => {
    console.log = jest.fn();

    beforeEach(() => {
        resetStoreConfig();

        configureStore({
            extensions: [new LoggerExtension()],
        });
    });

    it('should log a dispatched Action', () => {
        addFeature('counter', counterReducer);

        const action = { type: 'counter' };

        dispatch(action);

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
        const setStateCallback = () => ({
            firstName: 'Cage',
        });

        fs.setState(setStateCallback);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('@mini-rx/user/set-state'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            {
                type: '@mini-rx/user/set-state',
                payload: setStateCallback,
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

describe('LoggerExtension with ComponentStore', () => {
    it('should log a SetStateAction with only type and payload', () => {
        console.log = jest.fn();

        const cs = createComponentStore(userState, { extensions: [new LoggerExtension()] });

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('@mini-rx/component-store/init'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            {
                type: '@mini-rx/component-store/init',
            },
            expect.stringContaining('State:'),
            userState
        );

        const setStateCallback = () => ({
            firstName: 'Cage',
        });

        cs.setState(setStateCallback);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('@mini-rx/component-store/set-state'),
            expect.stringContaining('color: #25c2a0'),
            expect.stringContaining('Action:'),
            {
                type: '@mini-rx/component-store/set-state',
                payload: setStateCallback,
            },
            expect.stringContaining('State: '),
            {
                ...userState,
                firstName: 'Cage',
            }
        );
    });
});
