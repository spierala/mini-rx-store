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
    StoreType,
    undo,
} from '@mini-rx/common';
import { BaseStore } from './base-store';
import {
    addFeature,
    dispatch,
    hasUndoExtension,
    removeFeature,
    selectableAppState,
} from './store-core';
import { Signal } from '@angular/core';
import { createSelectableSignalState } from './selectable-signal-state';
import { ComponentStoreLike } from './models';

export class FeatureStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    state: Signal<StateType> = selectableAppState.select((state) => state[this.featureKey]);
    private selectableState = createSelectableSignalState(this.state);

    private readonly featureId: string;

    constructor(featureKey: string, initialState: StateType, config: FeatureStoreConfig = {}) {
        super();

        this._destroyRef.onDestroy(() => this.destroy());

        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + this.featureId : featureKey;

        addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchMiniRxAction(
        stateOrCallback: StateOrCallback<StateType>,
        actionType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> {
        const action: MiniRxAction<StateType> = {
            storeType: StoreType.FEATURE_STORE,
            type: createMiniRxActionType(actionType, this.featureKey, name),
            stateOrCallback,
            featureId: this.featureId,
        };
        dispatch(action);
        return action;
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action): void {
        hasUndoExtension
            ? dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    select = this.selectableState.select.bind(this.selectableState);

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
