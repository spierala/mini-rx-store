import { Action, ComponentStoreLike, FeatureStoreConfig, Reducer, StateOrCallback } from './models';
import { calcNewState, miniRxError } from './utils';
import {
    createMiniRxActionType,
    isMiniRxAction,
    OperationType,
    MiniRxAction,
    StoreType,
    undo,
} from './actions';
import { BaseStore } from './base-store';
import {
    addFeature,
    dispatch,
    hasUndoExtension,
    removeFeature,
    selectableAppState,
} from './store-core';
import { Signal } from '@angular/core';
import { SelectableSignalState } from './selectable-signal-state';

export class FeatureStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    state: Signal<StateType> = selectableAppState.select((state) => state[this.featureKey]);
    private selectableState = new SelectableSignalState(this.state);

    private readonly featureId: string;

    constructor(featureKey: string, initialState: StateType, config: FeatureStoreConfig = {}) {
        super();

        this._destroyRef.onDestroy(() => this.destroy());

        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + generateId() : featureKey;

        addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        actionType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> {
        // const action = createSetStateAction(StoreType.FEATURE_STORE, actionType, stateOrCallback, name, this.featureKey, this.featureId );
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

function createFeatureStoreReducer<StateType>(
    featureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (
            isMiniRxAction<StateType>(action, StoreType.FEATURE_STORE) &&
            action.featureId === featureId
        ) {
            return calcNewState(state, action.stateOrCallback);
        }
        return state;
    };
}

// Simple alpha numeric ID: https://stackoverflow.com/a/12502559/453959
// This isn't a real GUID!
function generateId(): string {
    return Math.random().toString(36).slice(2);
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
