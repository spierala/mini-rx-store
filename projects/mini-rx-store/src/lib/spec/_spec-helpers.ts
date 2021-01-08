import { Action } from '../models';

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
    action: Action
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
