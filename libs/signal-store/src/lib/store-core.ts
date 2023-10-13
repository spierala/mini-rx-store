import { Observable } from 'rxjs';
import {
    Action,
    Actions,
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
    sortExtensions,
    StoreConfig,
    StoreExtension,
} from '@mini-rx/common';
import { signal, WritableSignal } from '@angular/core';
import { createSelectableSignalState } from './selectable-signal-state';

export let hasUndoExtension = false;
let isStoreInitialized = false;

// REDUCER MANAGER
// exported for testing purposes
export const reducerManager = createReducerManager();

// ACTIONS
const actionsOnQueue = createActionsOnQueue();
export const actions$: Actions = actionsOnQueue.actions$;

// APP STATE
const appState: WritableSignal<AppState> = signal({});
export const selectableAppState = createSelectableSignalState(appState);

// Wire up the Redux Store: Init reducer state, subscribe to the actions, calc next state for every action
// Called by `configureStore` and `addReducer`
function initStore(): void {
    if (isStoreInitialized) {
        return;
    }

    // Listen to the Actions stream and update state accordingly
    actionsOnQueue.actions$.subscribe((action) => {
        const nextState: AppState = reducerManager.getReducer()(appState(), action);
        appState.set(nextState);
    });

    isStoreInitialized = true;
}

export function configureStore(config: StoreConfig<AppState> = {}): void {
    initStore();

    if (config.metaReducers) {
        reducerManager.addMetaReducers(...config.metaReducers);
    }

    if (config.extensions) {
        sortExtensions(config.extensions).forEach((extension) => addExtension(extension));
    }

    if (config.reducers) {
        reducerManager.setFeatureReducers(config.reducers);
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
    reducerManager.addFeatureReducer(featureKey, reducer, config.metaReducers, config.initialState);
    dispatch({ type: createMiniRxActionType(OperationType.INIT, featureKey) });
}

export function removeFeature(featureKey: string): void {
    reducerManager.removeFeatureReducer(featureKey);
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

// exported for testing purposes
export function addExtension(extension: StoreExtension): void {
    const metaReducer: MetaReducer<any> | void = extension.init();

    if (metaReducer) {
        reducerManager.addMetaReducers(metaReducer);
    }

    if (extension.id === ExtensionId.UNDO) {
        hasUndoExtension = true;
    }
}

export function dispatch(action: Action): void {
    actionsOnQueue.dispatch(action);
}

export function updateAppState(state: AppState): void {
    appState.set(state);
}
