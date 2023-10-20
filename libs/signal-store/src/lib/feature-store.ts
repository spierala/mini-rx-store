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
} from '@mini-rx/common';
import {
    addFeature,
    dispatch,
    hasUndoExtension,
    removeFeature,
    selectableAppState,
} from './store-core';
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

    state: Signal<StateType> = selectableAppState.select((state) => state[this.featureKey]);
    private selectableState = createSelectableSignalState(this.state);

    private dispatcher = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        const action: MiniRxAction<StateType> = {
            type: createMiniRxActionType(operationType, this.featureKey, name),
            stateOrCallback,
            featureId: this.featureId,
        };
        dispatch(action);
        return action;
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

    select = this.selectableState.select;
    update = createUpdateFn(this.dispatcher);
    connect = createConnectFn(this.dispatcher);
    rxEffect = createRxEffectFn();

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
