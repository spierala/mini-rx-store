import { isMiniRxAction } from './is-mini-rx-action';
import { Action, MiniRxAction, StoreType } from './models';

describe('isMiniRxAction', () => {
    it('should detect MiniRx action for StoreType (ComponentStore/FeatureStore)', () => {
        const action: MiniRxAction<any> = {
            type: '',
            storeType: StoreType.FEATURE_STORE,
            stateOrCallback: {},
        };

        expect(isMiniRxAction(action, StoreType.FEATURE_STORE)).toBe(true);
        expect(isMiniRxAction(action, StoreType.COMPONENT_STORE)).toBe(false);

        const action2: MiniRxAction<any> = {
            type: '',
            storeType: StoreType.COMPONENT_STORE,
            stateOrCallback: {},
        };

        expect(isMiniRxAction(action2, StoreType.COMPONENT_STORE)).toBe(true);
        expect(isMiniRxAction(action2, StoreType.FEATURE_STORE)).toBe(false);

        const someAction: Action = { type: 'someAction' };
        expect(isMiniRxAction(someAction, StoreType.FEATURE_STORE)).toBe(false);
        expect(isMiniRxAction(someAction, StoreType.COMPONENT_STORE)).toBe(false);
    });
});
