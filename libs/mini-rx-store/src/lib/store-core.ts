import { Observable } from 'rxjs';
import {
    Action,
    Actions,
    AppState,
    EFFECT_METADATA_KEY,
    EffectConfig,
    ExtensionId,
    HasEffectMetadata,
    MetaReducer,
    Reducer,
    ReducerDictionary,
    StoreConfig,
    StoreExtension,
} from './models';
import { combineMetaReducers, hasEffectMetaData, miniRxError } from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { combineReducers } from './combine-reducers';
import { createMiniRxAction, MiniRxActionType } from './actions';
import { State } from './state';
import { ActionsOnQueue } from './actions-on-queue';
import { ComponentStore } from './component-store';

type ReducerState = {
    featureReducers: ReducerDictionary<AppState>;
    metaReducers: MetaReducer<AppState>[];
};

class ReducerStore extends ComponentStore<ReducerState> {
    // APP STATE REDUCER
    reducer$: Observable<Reducer<AppState>> = this.select((v) => {
        const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(v.metaReducers);
        const combinedReducer: Reducer<AppState> = combineReducers(v.featureReducers);
        return combinedMetaReducer(combinedReducer);
    });

    hasFeatureReducers(): boolean {
        return !!Object.keys(this.state.featureReducers).length;
    }

    constructor() {
        super({
            featureReducers: {},
            metaReducers: [],
        });
    }

    addReducer(featureKey: string, reducer: Reducer<any>) {
        this.checkFeatureExists(featureKey);

        this.setState((state) => ({
            featureReducers: { ...state.featureReducers, [featureKey]: reducer },
        }));
    }

    removeReducer(featureKey: string) {
        this.setState((state) => ({
            featureReducers: omit(state.featureReducers, featureKey) as ReducerDictionary<AppState>,
        }));
    }

    addMetaReducers(...reducers: MetaReducer<AppState>[]) {
        this.setState((state) => ({
            metaReducers: [...state.metaReducers, ...reducers],
        }));
    }

    private checkFeatureExists(featureKey: string) {
        if (this.state.featureReducers.hasOwnProperty(featureKey)) {
            miniRxError(`Feature "${featureKey}" already exists.`);
        }
    }
}

class StoreCore {
    // ACTIONS
    private actionsOnQueue = new ActionsOnQueue();
    actions$: Actions = this.actionsOnQueue.actions$;

    // APP STATE
    appState = new State<AppState>();

    // REDUCERS
    reducerStore = new ReducerStore();

    hasUndoExtension = false;

    constructor() {
        let reducer: Reducer<AppState>;
        // 👇 Instead of using `withLatestFrom` inside this.actionsOnQueue.actions$.pipe (fewer operators = less bundle-size :))
        this.reducerStore.reducer$.subscribe((v) => (reducer = v));

        // Listen to the Actions stream and update state accordingly
        this.actionsOnQueue.actions$.subscribe((action) => {
            const newState: AppState = reducer(
                this.appState.get()!, // Initially undefined, but the reducer can handle undefined (by falling back to initial state)
                action
            );
            this.appState.set(newState);
        });
    }

    config(config: Partial<StoreConfig<AppState>> = {}) {
        if (this.reducerStore.hasFeatureReducers()) {
            miniRxError(
                '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
            );
        }

        if (config.metaReducers?.length) {
            this.reducerStore.addMetaReducers(...config.metaReducers);
        }

        if (config.extensions?.length) {
            const sortedExtensions: StoreExtension[] = sortExtensions(config.extensions);
            sortedExtensions.forEach((extension) => this.addExtension(extension));
        }

        if (config.reducers) {
            Object.keys(config.reducers).forEach((featureKey) => {
                this.reducerStore.addReducer(featureKey, config.reducers![featureKey]); // config.reducers! (prevent TS2532: Object is possibly 'undefined')
            });
        }

        if (config.initialState) {
            this.appState.set(config.initialState);
        }

        this.dispatch(createMiniRxAction(MiniRxActionType.INIT_STORE));
    }

    addFeature<StateType>(
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

        this.reducerStore.addReducer(featureKey, reducer);
        this.dispatch(createMiniRxAction(MiniRxActionType.INIT_FEATURE, featureKey));
    }

    removeFeature(featureKey: string) {
        this.reducerStore.removeReducer(featureKey);
        this.dispatch(createMiniRxAction(MiniRxActionType.DESTROY_FEATURE, featureKey));
    }

    dispatch(action: Action) {
        this.actionsOnQueue.dispatch(action);
    }

    effect(effect$: Observable<any> & HasEffectMetadata): void;
    effect(effect$: Observable<Action>): void;
    effect(effect$: any): void {
        const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
        effectWithErrorHandler$.subscribe((action) => {
            let dispatch = true;
            if (hasEffectMetaData(effect$)) {
                const metaData: EffectConfig = effect$[EFFECT_METADATA_KEY];
                dispatch = !!metaData.dispatch;
            }

            if (dispatch) {
                this.dispatch(action);
            }
        });
    }

    addMetaReducers = this.reducerStore.addMetaReducers.bind(this.reducerStore);

    addExtension(extension: StoreExtension) {
        extension.init();

        if (extension.id === ExtensionId.UNDO) {
            this.hasUndoExtension = true;
        }
    }
}

function createReducerWithInitialState<StateType>(
    reducer: Reducer<StateType>,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        return reducer(state, action);
    };
}

function sortExtensions(extensions: StoreExtension[]): StoreExtension[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}

function omit<T extends Record<string, any>>(object: T, keyToOmit: keyof T): Partial<T> {
    return Object.keys(object)
        .filter((key) => key !== keyToOmit)
        .reduce<Partial<T>>((prevValue, key: keyof T) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {});
}

// Created once to initialize singleton
export default new StoreCore();
