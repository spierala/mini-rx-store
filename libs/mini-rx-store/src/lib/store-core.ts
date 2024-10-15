import { Subscription } from 'rxjs';
import { createState } from './state';
import {
    AppState,
    createActionsOnQueue,
    createMiniRxActionType,
    createReducerManager,
    createRxEffectForStore,
    ExtensionId,
    MetaReducer,
    miniRxError,
    OperationType,
    Reducer,
    ReducerManager,
    sortExtensions,
    StoreConfig,
    StoreExtension,
} from '@mini-rx/common';

function createStore() {
    let hasUndoExtension = false;
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
    const {actions$, dispatch} = createActionsOnQueue();

    // APP STATE
    const appState = createState<AppState>();

    // Wire up the Redux Store: subscribe to the actions stream, calc next state for every action
    // Called by `configureStore` and `addReducer`
    function initStore(): void {
        if (actionSubscription) {
            return;
        }

        // Listen to the Actions stream and update state
        actionSubscription = actions$.subscribe((action) => {
            const nextState: AppState = getReducerManager().reducer(appState.get() ?? {}, action);
            appState.set(nextState);
        });
    }

    function configureStore(config: StoreConfig<AppState> = {}) {
        initStore();

        if (getReducerManager().hasFeatureReducers()) {
            miniRxError(
                '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
            );
        }

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

        dispatch({type: createMiniRxActionType(OperationType.INIT)});

        return {
            dispatch,
            feature: addFeature,
            effect,
            select: appState.select
        }
    }

    function addFeature<StateType extends object>(
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
        dispatch({type: createMiniRxActionType(OperationType.INIT, featureKey)});
    }

    function removeFeature(featureKey: string): void {
        getReducerManager().removeFeatureReducer(featureKey);
        dispatch({type: createMiniRxActionType(OperationType.DESTROY, featureKey)});
    }

    const effect = createRxEffectForStore(dispatch);

    function addExtension(extension: StoreExtension): void {
        const metaReducer: MetaReducer<AppState> | void = extension.init();

        if (metaReducer) {
            getReducerManager().addMetaReducers(metaReducer);
        }

        hasUndoExtension = extension.id === ExtensionId.UNDO;
    }

    // Used for testing
    function destroy(): void {
        actionSubscription?.unsubscribe();
        actionSubscription = undefined;
        reducerManager = undefined;
    }

    return {
        hasUndoExtension,
        actions$,
        dispatch,
        appState,
        addFeature,
        removeFeature,
        effect,
        addExtension,
        configureStore,
        destroy
    }
}

export const storeCore = createStore();
export const actions$ = storeCore.actions$
