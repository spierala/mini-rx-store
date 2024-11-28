import {
    Action,
    createMiniRxActionType,
    createUpdateFn,
    OperationType,
    StateOrCallback,
} from '@mini-rx/common';

describe('createUpdateFn', () => {
    it('should create a setState function using OperationType.SET_STATE', () => {
        const setState = createUpdateFn(
            (
                stateOrCallback: StateOrCallback<object>,
                operationType: OperationType,
                name: string | undefined
            ): Action => {
                return {
                    type: createMiniRxActionType(operationType, 'feature', name),
                    stateOrCallback,
                };
            }
        );

        const someState = {};
        const action = setState(someState, 'name');

        expect(action).toStrictEqual({
            stateOrCallback: someState,
            type: '@mini-rx/feature/set-state/name',
        });
    });
});
