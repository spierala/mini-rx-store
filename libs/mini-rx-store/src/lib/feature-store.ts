import { ComponentStoreLike } from './models';
import {
    Action,
    createFeatureStoreReducer,
    createMiniRxActionType,
    createSubSink,
    createUpdateFn,
    FeatureStoreConfig,
    generateFeatureKey,
    generateId,
    MiniRxAction,
    miniRxError,
    OperationType,
    StateOrCallback,
    undo,
    UpdateStateCallback,
} from '@mini-rx/common';
import { createEffectFn } from './create-effect-fn';
import { createLazyState } from './create-state';
import { createAssertState } from './assert-state';
import { createConnectFn } from './create-connect-fn';
import { storeCore } from './store-core';

export class FeatureStore<StateType extends object> implements ComponentStoreLike<StateType> {
    private readonly featureId: string;
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private _state = createLazyState<StateType>();
    get state(): StateType {
        this.assertState.isInitialized();
        return this._state.get()!;
    }

    private updateState: UpdateStateCallback<StateType> = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        this.assertState.isInitialized();
        return storeCore.dispatch({
            type: createMiniRxActionType(operationType, this.featureKey, name),
            stateOrCallback,
            featureId: this.featureId,
        });
    };

    private subSink = createSubSink();
    private assertState = createAssertState(this.constructor.name, this._state);

    constructor(
        featureKey: string,
        initialState: StateType | undefined,
        config: FeatureStoreConfig = {}
    ) {
        this.featureId = generateId();
        this._featureKey = generateFeatureKey(featureKey, config.multi);

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    setInitialState(initialState: StateType): void {
        this.assertState.isNotInitialized();

        storeCore.addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );

        this.subSink.sink = storeCore.appState
            .select((state) => state[this.featureKey])
            .subscribe((v) => this._state.set(v));
    }

    undo(action: Action): void {
        storeCore.hasUndoExtension
            ? storeCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    setState = createUpdateFn(this.updateState);
    connect = createConnectFn(this.updateState, this.subSink);
    effect = createEffectFn(this.subSink);
    select = this._state.select;

    destroy() {
        this.subSink.unsubscribe();
        storeCore.removeFeature(this._featureKey);
    }

    /**
     * @internal
     * Can be called by Angular if ComponentStore/FeatureStore is provided in a component
     */
    ngOnDestroy() {
        this.destroy();
    }
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T | undefined,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
