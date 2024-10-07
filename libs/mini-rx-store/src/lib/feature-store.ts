import { ComponentStoreLike } from './models';
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
import { createState } from './state';
import { Observable } from 'rxjs';
import { assertStateIsInitialized, assertStateIsNotInitialized } from './assert-state';

export class FeatureStore<StateType extends object> implements ComponentStoreLike<StateType> {
    private readonly featureId: string;
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private subSink = createSubSink();

    private _state = createState<StateType>();
    state$: Observable<StateType> = this._state.select();
    get state(): StateType {
        assertStateIsInitialized(this._state, this.constructor.name);
        return this._state.get()!;
    }

    private updateState: UpdateStateCallback<StateType> = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        assertStateIsInitialized(this._state, this.constructor.name);
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
        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + generateId() : featureKey;

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    setInitialState(initialState: StateType): void {
        assertStateIsNotInitialized(this._state, this.constructor.name);

        addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );

        this.subSink.sink = appState
            .select((state) => state[this.featureKey])
            .subscribe((v) => this._state.set(v));
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action): void {
        hasUndoExtension
            ? dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    setState = createUpdateFn(this.updateState);
    effect = createEffectFn(this.subSink);
    select = this._state.select;

    destroy() {
        this.subSink.unsubscribe();
        removeFeature(this._featureKey);
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
