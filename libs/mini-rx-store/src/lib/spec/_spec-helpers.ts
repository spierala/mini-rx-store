import { configureStore, Store } from '../store';
import { Action } from '@mini-rx/common';
import { storeCore } from "../store-core";

export function destroyStore() {
    storeCore.destroy();
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

export const store: Store = configureStore({});

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
