import { createMiniRxActionType, OperationType } from './create-mini-rx-action-type';

describe('createMiniRxActionType', () => {
    it('should create a MiniRx Action Type', () => {
        const featureKey = 'todos';

        const type = createMiniRxActionType(OperationType.INIT, featureKey);
        expect(type).toBe('@mini-rx/todos/init');

        const type2 = createMiniRxActionType(OperationType.DESTROY, featureKey);
        expect(type2).toBe('@mini-rx/todos/destroy');

        const type3 = createMiniRxActionType(OperationType.CONNECTION, featureKey, 'someKey');
        expect(type3).toBe('@mini-rx/todos/connection/someKey');

        const type4 = createMiniRxActionType(OperationType.SET_STATE, featureKey, 'someName');
        expect(type4).toBe('@mini-rx/todos/set-state/someName');
    });
});
