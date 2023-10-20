import { Action, ComponentStoreExtension, ExtensionId, MetaReducer } from '@mini-rx/common';
import { dispatch, reducerManager } from '../store-core';

export function resetStoreConfig() {
    reducerManager._reducerStateSource.next({ featureReducers: {}, metaReducers: [] });
    dispatch({ type: 'resetStoreConfig' }); // Trigger action to recalculate state
}

export interface UserState {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    err: string | undefined;
}

export const userState: UserState = {
    firstName: 'Bruce',
    lastName: 'Willis',
    city: 'LA',
    country: 'United States',
    err: undefined,
};

export interface CounterState {
    counter: number;
}

export const counterInitialState: CounterState = {
    counter: 1,
};

export function counterReducer(
    state: CounterState = counterInitialState,
    action: Action,
    incrementCase = 'counter'
) {
    switch (action.type) {
        case incrementCase:
            return {
                ...state,
                counter: state.counter + 1,
            };
        default:
            return state;
    }
}

export class MockLoggerExtension implements ComponentStoreExtension {
    id = ExtensionId.LOGGER;
    sortOrder = 1;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return (v) => v;
    }
}

export class MockUndoExtension implements ComponentStoreExtension {
    id = ExtensionId.UNDO;
    sortOrder = 1;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return (v) => v;
    }
}

export class MockImmutableStateExtension implements ComponentStoreExtension {
    id = ExtensionId.IMMUTABLE_STATE;
    sortOrder = 1;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return (v) => v;
    }
}
