import { ComponentStoreLike } from './models';
import { BaseStore } from './base-store';
import { addFeature, appState, dispatch, hasUndoExtension, removeFeature } from './store-core';
import {
    Action,
    createFeatureStoreReducer,
    createMiniRxActionType,
    FeatureStoreConfig,
    generateId,
    miniRxError,
    OperationType,
    StateOrCallback,
    undo,
} from '@mini-rx/common';

export class FeatureStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private readonly featureId: string;

    constructor(
        featureKey: string,
        initialState: StateType | undefined,
        config: FeatureStoreConfig = {}
    ) {
        super();

        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + generateId() : featureKey;

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    override setInitialState(initialState: StateType): void {
        super.setInitialState(initialState);

        addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );

        this._sub.add(
            appState.select((state) => state[this.featureKey]).subscribe((v) => this._state.set(v))
        );
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name: string | undefined
    ): Action {
        const action = {
            type: createMiniRxActionType(OperationType.SET_STATE, this.featureKey, name),
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

    override destroy() {
        super.destroy();
        removeFeature(this._featureKey);
    }
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T | undefined,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
