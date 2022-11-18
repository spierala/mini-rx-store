import { BaseStore } from './base-store';
import { deepFreeze } from './deep-freeze';
import { StateOrCallback } from './models';
import { calcNewState } from './utils';
import { isImmutableStateExtensionInitialized } from './extensions/immutable-state.extension';

export class ComponentStore<StateType extends object> extends BaseStore<StateType> {
    override setInitialState(initialState: StateType): void {
        super.setInitialState(initialState);

        this.updateState(initialState);
    }

    override setState(stateOrCallback: StateOrCallback<StateType>, name?: string): void {
        super.setState(stateOrCallback, name);

        const newState: StateType = calcNewState(this.state, stateOrCallback);
        this.updateState(newState);
    }

    private updateState(state: StateType): void {
        this.stateSource.next(isImmutableStateExtensionInitialized ? deepFreeze(state) : state);
    }
}

export function createComponentStore<T extends object>(
    initialState: T | undefined
): ComponentStore<T> {
    return new ComponentStore<T>(initialState);
}
