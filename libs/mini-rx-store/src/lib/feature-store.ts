import { Action, FeatureStoreConfig, ComponentStoreLike, Reducer, StateOrCallback } from './models';
import { calcNewState, miniRxError } from './utils';
import {
    createMiniRxActionType,
    isSetStateAction,
    MiniRxActionType,
    SetStateAction,
    undo,
} from './actions';
import { BaseStore } from './base-store';
import { getStoreCore } from './store-core';

export class FeatureStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private readonly featureId: string;

    private storeCore = getStoreCore();

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

        this.storeCore.addFeature<StateType>(
            this._featureKey,
            createFeatureStoreReducer(this.featureId, initialState)
        );

        this._sub.add(
            this.storeCore.appState
                .select((state) => state[this.featureKey])
                .subscribe((v) => this._state.set(v))
        );
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name: string | undefined
    ): Action {
        const action = createSetStateAction(stateOrCallback, this.featureId, this.featureKey, name);
        this.storeCore.dispatch(action);
        return action;
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action): void {
        this.storeCore.hasUndoExtension
            ? this.storeCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    override destroy() {
        super.destroy();
        this.storeCore.removeFeature(this._featureKey);
    }
}

function createFeatureStoreReducer<StateType>(
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

function createSetStateAction<T>(
    stateOrCallback: StateOrCallback<T>,
    featureId: string,
    featureKey: string,
    name?: string
): SetStateAction<T> {
    const miniRxActionType = MiniRxActionType.SET_STATE;
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey) + (name ? '/' + name : ''),
        stateOrCallback,
        featureId,
        featureKey,
        miniRxActionType,
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
