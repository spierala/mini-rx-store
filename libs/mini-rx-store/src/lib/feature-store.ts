import { Action, FeatureStoreConfig, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { calcNewState, miniRxError } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { createSetStateAction, isSetStateAction } from './actions';
import { BaseStore } from './base-store';

export class FeatureStore<StateType extends object> extends BaseStore<StateType> {
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
        super(initialState);

        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + generateId() : featureKey;

        this.initFeature();
    }

    override setInitialState(initialState: StateType): void {
        super.setInitialState(initialState);

        this.initFeature();
    }

    private initFeature(): void {
        if (this.initialState) {
            StoreCore.addFeature<StateType>(
                this._featureKey,
                createFeatureReducer(this.featureId, this.initialState)
            );

            this.sub.add(
                StoreCore.select((state) => state[this.featureKey]).subscribe(this.stateSource)
            );
        }
    }

    override setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        super.setState(stateOrCallback, name);

        const action = createSetStateAction(stateOrCallback, this.featureId, this.featureKey, name);
        StoreCore.dispatch(action);
        return action;
    }

    undo(action: Action) {
        isUndoExtensionInitialized
            ? StoreCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    override destroy() {
        super.destroy();
        StoreCore.removeFeature(this._featureKey);
    }
}

function createFeatureReducer<StateType>(
    featureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (isSetStateAction<StateType>(action) && action.featureId === featureId) {
            return calcNewState(state, action.stateOrCallback);
        }
        return state;
    };
}

// Simple alpha numeric ID: https://stackoverflow.com/a/12502559/453959
// This isn't a real GUID!
function generateId() {
    return Math.random().toString(36).slice(2);
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T | undefined,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
