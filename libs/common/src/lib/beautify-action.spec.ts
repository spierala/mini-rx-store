import { beautifyAction } from './beautify-action';
import { MiniRxAction } from './models';
import { createMiniRxActionType, OperationType } from './create-mini-rx-action-type';
import { StoreType } from './enums';

describe('beautifyAction', () => {
    it('should remove extra fields from FeatureStore/ComponentStore Actions', () => {
        const csAction: MiniRxAction<any> = {
            storeType: StoreType.COMPONENT_STORE,
            type: createMiniRxActionType(OperationType.SET_STATE, 'todos'),
            stateOrCallback: {},
        };

        expect(beautifyAction(csAction)).toEqual({
            type: '@mini-rx/todos/set-state',
            payload: {},
        });

        const fsAction: MiniRxAction<any> = {
            storeType: StoreType.FEATURE_STORE,
            type: createMiniRxActionType(OperationType.SET_STATE, 'todos'),
            stateOrCallback: {},
            featureId: 'someFeatureId',
        };

        expect(beautifyAction(fsAction)).toEqual({
            type: '@mini-rx/todos/set-state',
            payload: {},
        });
    }),
        it('should not touch other normal Actions', () => {
            const action = { type: 'someAction' };

            expect(beautifyAction(action)).toBe(action);
        });
});