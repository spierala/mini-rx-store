import { DestroyRef, inject, Signal } from '@angular/core';
import {
    Action,
    createFeatureStoreReducer,
    createMiniRxActionType,
    FeatureStoreConfig,
    generateId,
    MiniRxAction,
    miniRxError,
    OperationType,
    StateOrCallback,
    undo,
    UpdateStateCallback,
} from '@mini-rx/common';
import { addFeature, dispatch, hasUndoExtension, removeFeature, select } from './store-core';
import { createSelectableSignalState } from './selectable-signal-state';
import { ComponentStoreLike } from './models';
import { createRxEffectFn } from './rx-effect';
import { createConnectFn } from './connect';
import { createUpdateFn } from './update';

export class FeatureStore<StateType extends object> implements ComponentStoreLike<StateType> {
    private readonly featureId: string;
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    /**
     * @deprecated
     * Use the `select` method without arguments to return a state Signal
     * the `state` property will be replaced with a getter function which returns the raw state (like in the original MiniRx Store)
     */
    state: Signal<StateType> = select((state) => state[this.featureKey]);

    private updateState: UpdateStateCallback<StateType> = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        return dispatch({
            type: createMiniRxActionType(operationType, this.featureKey, name),
            stateOrCallback,
            featureId: this.featureId,
        });
    };

    constructor(featureKey: string, initialState: StateType, config: FeatureStoreConfig = {}) {
        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + this.featureId : featureKey;

        addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );

        inject(DestroyRef).onDestroy(() => this.destroy());
    }

    undo(action: Action): void {
        hasUndoExtension
            ? dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    setState = createUpdateFn(this.updateState);
    connect = createConnectFn(this.updateState);
    rxEffect = createRxEffectFn();
    select = createSelectableSignalState(this.state).select;

    private destroy(): void {
        removeFeature(this._featureKey);
    }
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
