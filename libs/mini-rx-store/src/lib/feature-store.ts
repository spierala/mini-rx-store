import { ComponentStoreLike } from './models';
import { BaseStore } from './base-store';
import { addFeature, appState, dispatch, hasUndoExtension, removeFeature } from './store-core';
import {
    Action,
    createFeatureStoreReducer,
    createMiniRxActionType,
    createSubSink,
    FeatureStoreConfig,
    generateId,
    MiniRxAction,
    miniRxError,
    OperationType,
    StateOrCallback,
    undo,
    UpdateStateCallback,
} from '@mini-rx/common';
import { createEffectFn } from './effect';
import { createUpdateFn } from './update';

export class FeatureStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private readonly featureId: string;
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private subSink = createSubSink();

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

    // Implementation of abstract method from BaseStore
    undo(action: Action): void {
        hasUndoExtension
            ? dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    effect = createEffectFn(this.subSink);
    setState = createUpdateFn(this.updateState);

    override destroy() {
        super.destroy();
        this.subSink.unsubscribe();
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
