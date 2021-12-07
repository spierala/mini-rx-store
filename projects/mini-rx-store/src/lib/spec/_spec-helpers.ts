import { Action, ActionWithPayload, AppState, MetaReducer } from '../models';
import { configureStore, Store } from '../store';
import { default as StoreCore } from '../store-core';
import { combineMetaReducers } from '../utils';
import { combineReducers } from '../combine-reducers';

export const store: Store = configureStore({});

export function resetStoreConfig() {
    StoreCore['extensions'] = [];
    StoreCore['metaReducers'] = [];
    StoreCore['combinedMetaReducer'] = combineMetaReducers([]);
    StoreCore['reducers'] = {};
    StoreCore['combinedReducer'] = combineReducers({});
}

export interface CounterState {
    counter: number;
}

export const counterInitialState: CounterState = {
    counter: 1,
};

export function counterReducer(state: CounterState = counterInitialState, action: Action) {
    switch (action.type) {
        case 'counter':
            return {
                ...state,
                counter: state.counter + 1,
            };
        default:
            return state;
    }
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
