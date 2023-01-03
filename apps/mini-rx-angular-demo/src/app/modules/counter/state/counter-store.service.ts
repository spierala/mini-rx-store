import { ComponentStore, createComponentStore } from 'mini-rx-store';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 42,
};

const counterCs: ComponentStore<CounterState> = createComponentStore<CounterState>(initialState);
