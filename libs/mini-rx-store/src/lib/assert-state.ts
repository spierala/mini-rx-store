import { miniRxError } from '@mini-rx/common';

type State = { get: () => object | undefined };

export function createAssertState(constructorName: string, state: State) {
    function isInitialized(): void | never {
        const notInitializedErrorMessage =
            `${constructorName} has no initialState yet. ` +
            `Please provide an initialState before updating/getting state.`;

        if (!state.get()) {
            miniRxError(notInitializedErrorMessage);
        }
    }

    function isNotInitialized(): void | never {
        const initializedErrorMessage = `${constructorName} has initialState already.`;

        if (state.get()) {
            miniRxError(initializedErrorMessage);
        }
    }

    return {
        isInitialized,
        isNotInitialized,
    };
}
