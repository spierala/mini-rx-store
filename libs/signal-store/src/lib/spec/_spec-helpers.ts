import {
    Action,
    ActionWithPayload,
    ComponentStoreExtension,
    ExtensionId,
    MetaReducer,
    Reducer,
} from '@mini-rx/common';
import { v4 as uuid } from 'uuid';
import { dispatch, reducerState } from '../store-core';

export function resetStoreConfig() {
    reducerState.set({
        metaReducers: [],
        featureReducers: {},
    });

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

export function createUniqueCounterReducerWithAction(): [Reducer<CounterState>, Action] {
    const incrementCase = uuid();
    const reducer = (state: CounterState = counterInitialState, action: Action) => {
        switch (action.type) {
            case incrementCase:
                return {
                    ...state,
                    counter: state.counter + 1,
                };
            default:
                return state;
        }
    };
    return [reducer, { type: incrementCase }];
}

export interface CounterStringState {
    counter: string;
}

export const counterStringInitialState: CounterStringState = {
    counter: '1',
};

export function counterStringReducer(
    state: CounterStringState = counterStringInitialState,
    action: ActionWithPayload
) {
    switch (action.type) {
        case 'counterString':
            return {
                ...state,
                counter: state.counter + action.payload,
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
