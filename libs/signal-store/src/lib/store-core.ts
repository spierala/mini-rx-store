import { signal, WritableSignal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
    Action,
    AppState,
    createActionsOnQueue,
    createMiniRxActionType,
    createReducerManager,
    defaultEffectsErrorHandler,
    EFFECT_METADATA_KEY,
    EffectConfig,
    ExtensionId,
    HasEffectMetadata,
    hasEffectMetaData,
    MetaReducer,
    OperationType,
    Reducer,
    ReducerManager,
    sortExtensions,
    StoreConfig,
    StoreExtension,
} from '@mini-rx/common';
import { createSelectableSignalState } from './selectable-signal-state';

export let hasUndoExtension = false;
let actionSubscription: Subscription | undefined;

// REDUCER MANAGER
let reducerManager: ReducerManager | undefined;
function getReducerManager(): ReducerManager {
    if (!reducerManager) {
        reducerManager = createReducerManager();
    }
    return reducerManager;
}

// ACTIONS
export const { actions$, dispatch } = createActionsOnQueue();

// APP STATE
const appState: WritableSignal<AppState> = signal({});
export const { select } = createSelectableSignalState(appState);

// Wire up the Redux Store: subscribe to the actions stream, calc next state for every action
// Called by `configureStore` and `addReducer`
function initStore(): void {
    if (actionSubscription) {
        return;
    }

    // Listen to the Actions stream and update state
    actionSubscription = actions$.subscribe((action) => {
        const nextState: AppState = getReducerManager().reducer(appState(), action);
        appState.set(nextState);
    });
}

export function configureStore(config: StoreConfig<AppState> = {}): void {
    initStore();

    if (config.metaReducers) {
        getReducerManager().addMetaReducers(...config.metaReducers);
    }
    if (config.extensions) {
        sortExtensions(config.extensions).forEach((extension) => addExtension(extension));
    }
    if (config.reducers) {
        getReducerManager().setFeatureReducers(config.reducers);
    }
    if (config.initialState) {
        appState.set(config.initialState);
    }

    dispatch({ type: createMiniRxActionType(OperationType.INIT) });
}

export function addFeature<StateType extends object>(
    featureKey: string,
    reducer: Reducer<StateType>,
    config: {
        metaReducers?: MetaReducer<StateType>[];
        initialState?: StateType;
    } = {}
): void {
    initStore();
    getReducerManager().addFeatureReducer(
        featureKey,
        reducer,
        config.metaReducers,
        config.initialState
    );
    dispatch({ type: createMiniRxActionType(OperationType.INIT, featureKey) });
}

export function removeFeature(featureKey: string): void {
    getReducerManager().removeFeatureReducer(featureKey);
    dispatch({ type: createMiniRxActionType(OperationType.DESTROY, featureKey) });
}

export function rxEffect(effect$: Observable<any> & HasEffectMetadata): void;
export function rxEffect(effect$: Observable<Action>): void;
export function rxEffect(effect$: any): void {
    const effectWithErrorHandler$: Observable<Action | any> = defaultEffectsErrorHandler(effect$);
    effectWithErrorHandler$.subscribe((action) => {
        let shouldDispatch = true;
        if (hasEffectMetaData(effect$)) {
            const metaData: EffectConfig = effect$[EFFECT_METADATA_KEY];
            shouldDispatch = !!metaData.dispatch;
        }
        if (shouldDispatch) {
            dispatch(action);
        }
    });
}

function addExtension(extension: StoreExtension): void {
    const metaReducer: MetaReducer<AppState> | void = extension.init();

    if (metaReducer) {
        getReducerManager().addMetaReducers(metaReducer);
    }

    hasUndoExtension = extension.id === ExtensionId.UNDO;
}

export function updateAppState(state: AppState): void {
    appState.set(state);
}

// Used for testing
export function destroy(): void {
    actionSubscription?.unsubscribe();
    actionSubscription = undefined;
    reducerManager = undefined;
}
