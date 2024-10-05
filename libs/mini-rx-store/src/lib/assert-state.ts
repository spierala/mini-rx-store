import { miniRxError } from '@mini-rx/common';

export function assertStateIsInitialized(
    state: { get: () => object | undefined },
    name: string
): void | never {
    const notInitializedErrorMessage =
        `${name} has no initialState yet. ` +
        `Please provide an initialState before updating/getting state.`;

    if (!state.get()) {
        miniRxError(notInitializedErrorMessage);
    }
}

export function assertStateIsNotInitialized(
    state: { get: () => object | undefined },
    name: string
): void | never {
    const initializedErrorMessage = `${name} has initialState already.`;

    if (state.get()) {
        miniRxError(initializedErrorMessage);
    }
}
