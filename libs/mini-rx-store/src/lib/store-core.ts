import { Observable } from 'rxjs';
import { createMiniRxAction } from './actions';
import { State } from './state';
import {
    StoreExtension,
    sortExtensions,
    ExtensionId,
    ReducerDictionary,
    AppState,
    MetaReducer,
    Reducer,
    Actions,
    StoreConfig,
    HasEffectMetadata,
    Action,
    EffectConfig,
    EFFECT_METADATA_KEY,
    hasEffectMetaData,
    defaultEffectsErrorHandler,
    miniRxError,
    createActionsOnQueue,
    OperationType,
    combineReducers,
    combineMetaReducers,
} from '@mini-rx/common';

export let hasUndoExtension = false;
let isStoreInitialized = false;

// REDUCER STATE
// exported for testing purposes
export const reducerState = new State<{
    featureReducers: ReducerDictionary<AppState>;
    metaReducers: MetaReducer<AppState>[];
}>();

const reducer$: Observable<Reducer<AppState>> = reducerState.select((v) => {
    const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(v.metaReducers);
    const combinedReducer: Reducer<AppState> = combineReducers(v.featureReducers);
    return combinedMetaReducer(combinedReducer);
});

function hasFeatureReducers(): boolean {
    return !!Object.keys(reducerState.get()!.featureReducers).length;
}

function checkFeatureExists(featureKey: string) {
    if (reducerState.get()!.featureReducers.hasOwnProperty(featureKey)) {
        miniRxError(`Feature "${featureKey}" already exists.`);
    }
}

function addReducer(featureKey: string, reducer: Reducer<any>) {
    initStore();

    checkFeatureExists(featureKey);

    reducerState.patch((state) => ({
        featureReducers: { ...state.featureReducers, [featureKey]: reducer },
    }));
}

function removeReducer(featureKey: string) {
    reducerState.patch((state) => ({
        featureReducers: omit(state.featureReducers, featureKey) as ReducerDictionary<AppState>,
    }));
}

// exported for testing purposes
export function addMetaReducers(...reducers: MetaReducer<AppState>[]) {
    reducerState.patch((state) => ({
        metaReducers: [...state.metaReducers, ...reducers],
    }));
}

// ACTIONS
const actionsOnQueue = createActionsOnQueue();
export const actions$: Actions = actionsOnQueue.actions$;

// APP STATE
export const appState = new State<AppState>();

// Wire up the Redux Store: Init reducer state, subscribe to the actions and reducer Observable
// Called by `configureStore` and `addReducer`
function initStore() {
    if (isStoreInitialized) {
        return;
    }

    reducerState.set({
        featureReducers: {},
        metaReducers: [],
    });

    let reducer: Reducer<AppState>;
    // 👇 We could use `withLatestFrom` inside actionsOnQueue.actions$.pipe, but fewer operators = less bundle-size :)
    reducer$.subscribe((v) => (reducer = v));

    // Listen to the Actions stream and update state accordingly
    actions$.subscribe((action) => {
        const newState: AppState = reducer(
            appState.get()!, // Initially undefined, but the reducer can handle undefined (by falling back to initial state)
            action
        );
        appState.set(newState);
    });

    isStoreInitialized = true;
}

export function configureStore(config: StoreConfig<AppState> = {}) {
    initStore();

    if (hasFeatureReducers()) {
        miniRxError(
            '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
        );
    }

    if (config.metaReducers?.length) {
        addMetaReducers(...config.metaReducers);
    }

    if (config.extensions?.length) {
        const sortedExtensions: StoreExtension[] = sortExtensions(config.extensions);
        sortedExtensions.forEach((extension) => addExtension(extension));
    }

    if (config.reducers) {
        Object.keys(config.reducers).forEach((featureKey) => {
            addReducer(featureKey, config.reducers![featureKey]); // config.reducers! (prevent TS2532: Object is possibly 'undefined')
        });
    }

    if (config.initialState) {
        appState.set(config.initialState);
    }

    dispatch(createMiniRxAction(OperationType.INIT));
}

export function addFeature<StateType>(
    featureKey: string,
    reducer: Reducer<StateType>,
    config: {
        metaReducers?: MetaReducer<StateType>[];
        initialState?: StateType;
    } = {}
): void {
    reducer = config.metaReducers?.length
        ? combineMetaReducers<StateType>(config.metaReducers)(reducer)
        : reducer;

    if (typeof config.initialState !== 'undefined') {
        reducer = createReducerWithInitialState(reducer, config.initialState);
    }

    addReducer(featureKey, reducer);
    dispatch(createMiniRxAction(OperationType.INIT, featureKey));
}

export function removeFeature(featureKey: string) {
    removeReducer(featureKey);
    dispatch(createMiniRxAction(OperationType.DESTROY, featureKey));
}

export function effect(effect$: Observable<any> & HasEffectMetadata): void;
export function effect(effect$: Observable<Action>): void;
export function effect(effect$: any): void {
    const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
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
export function addExtension(extension: StoreExtension) {
    const metaReducer: MetaReducer<any> | void = extension.init();

    if (metaReducer) {
        addMetaReducers(metaReducer);
    }

    if (extension.id === ExtensionId.UNDO) {
        hasUndoExtension = true;
    }
}

export function dispatch(action: Action) {
    actionsOnQueue.dispatch(action);
}

function createReducerWithInitialState<StateType>(
    reducer: Reducer<StateType>,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        return reducer(state, action);
    };
}

function omit<T extends Record<string, any>>(object: T, keyToOmit: keyof T): Partial<T> {
    return Object.keys(object)
        .filter((key) => key !== keyToOmit)
        .reduce<Partial<T>>((prevValue, key: keyof T) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {});
}
