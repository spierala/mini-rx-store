// Actions
import { action, on, reducer } from 'ts-action';

const increment = action('increment');
const decrement = action('decrement');
const same = action('same');

// Reducer
// The reducer is registered in the App Module
export const counterReducer = reducer(
    0,
    on(increment, (state) => state + 1),
    on(decrement, (state) => state - 1),
    on(same, (state) => state)
);
