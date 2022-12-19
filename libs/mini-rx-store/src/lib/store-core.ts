import { BehaviorSubject, Observable, queueScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
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
import { combineMetaReducers, hasEffectMetaData, miniRxError, select } from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { combineReducers } from './combine-reducers';
import { createMiniRxAction, MiniRxActionType } from './actions';
import { State } from './state';

type ReducerState = {
    featureReducers: ReducerDictionary<AppState>;
    metaReducers: MetaReducer<AppState>[];
};

class StoreCore {
    // ACTIONS
    private actionsSource = new Subject<Action>();
    actions$: Actions = this.actionsSource.asObservable();

    // APP STATE
    appState = new State<AppState>();

    // REDUCERS (Feature state reducers and meta reducers)
    private reducerStateSource = new BehaviorSubject<ReducerState>({
        featureReducers: {},
        metaReducers: [],
    });
    private get reducerState(): ReducerState {
        return this.reducerStateSource.getValue();
    }
    private get featureReducers(): ReducerDictionary<AppState> {
        return this.reducerState.featureReducers;
    }
    private set featureReducers(featureReducers: ReducerDictionary<AppState>) {
        this.reducerStateSource.next({
            ...this.reducerState,
            featureReducers,
        });
    }
    hasUndoExtension = false;

    constructor() {
        let reducer: Reducer<AppState>;
        // 👇 Refactored `withLatestFrom` in actions$.pipe to own subscription (fewer operators = less bundle-size :))
        this.reducerStateSource.subscribe((v) => {
            const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(v.metaReducers);
            const combinedReducer: Reducer<AppState> = combineReducers(v.featureReducers);
            reducer = combinedMetaReducer(combinedReducer);
        });

        // Listen to the Actions stream and update state accordingly
        this.actions$
            .pipe(
                observeOn(queueScheduler) // Prevent stack overflow: https://blog.cloudboost.io/so-how-does-rx-js-queuescheduler-actually-work-188c1b46526e
            )
            .subscribe((action) => {
                const newState: AppState = reducer(
                    this.appState.get()!, // Initially undefined, but the reducer can handle undefined (by falling back to initial state)
                    action
                );
                this.appState.set(newState);
            });
    }

    config(config: Partial<StoreConfig<AppState>> = {}) {
        if (Object.keys(this.featureReducers).length) {
            miniRxError(
                '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
            );
        }

        if (config.metaReducers?.length) {
            this.addMetaReducers(...config.metaReducers);
        }

        if (config.extensions?.length) {
            const sortedExtensions: StoreExtension[] = sortExtensions(config.extensions);
            sortedExtensions.forEach((extension) => this.addExtension(extension));
        }

        if (config.reducers) {
            Object.keys(config.reducers).forEach((featureKey) => {
                checkFeatureExists(featureKey, this.featureReducers);
                this.addReducer(featureKey, config.reducers![featureKey]); // config.reducers! (prevent TS2532: Object is possibly 'undefined')
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

        checkFeatureExists(featureKey, this.featureReducers);

        if (typeof config.initialState !== 'undefined') {
            reducer = createReducerWithInitialState(reducer, config.initialState);
        }

        this.addReducer(featureKey, reducer);
        this.dispatch(createMiniRxAction(MiniRxActionType.INIT_FEATURE, featureKey));
    }

    removeFeature(featureKey: string) {
        this.removeReducer(featureKey);
        this.dispatch(createMiniRxAction(MiniRxActionType.DESTROY_FEATURE, featureKey));
    }

    dispatch(action: Action) {
        this.actionsSource.next(action);
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

    addMetaReducers(...reducers: MetaReducer<AppState>[]) {
        this.reducerStateSource.next({
            ...this.reducerState,
            metaReducers: [...this.reducerState.metaReducers, ...reducers],
        });
    }

    addExtension(extension: StoreExtension) {
        extension.init();

        if (extension.id === ExtensionId.UNDO) {
            this.hasUndoExtension = true;
        }
    }

    private addReducer(featureKey: string, reducer: Reducer<any>) {
        this.featureReducers = { ...this.featureReducers, [featureKey]: reducer };
    }

    private removeReducer(featureKey: string) {
        this.featureReducers = omit(
            this.featureReducers,
            featureKey
        ) as ReducerDictionary<AppState>;
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

function checkFeatureExists(featureKey: string, reducers: ReducerDictionary<AppState>) {
    if (reducers.hasOwnProperty(featureKey)) {
        miniRxError(`Feature "${featureKey}" already exists.`);
    }
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
