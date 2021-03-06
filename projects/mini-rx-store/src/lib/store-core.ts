import { BehaviorSubject, Observable, queueScheduler, Subject } from 'rxjs';
import {
    Action,
    ActionMetaData,
    Actions,
    ActionWithMeta,
    AppState,
    MetaReducer,
    Reducer,
    ReducerDictionary,
    StoreConfig,
    StoreExtension,
} from './models';
import { catchError, map, observeOn, tap, withLatestFrom } from 'rxjs/operators';
import {
    combineMetaReducers,
    combineReducers,
    createActionTypePrefix,
    miniRxError,
    select,
    storeInitActionType,
} from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';

class StoreCore {
    // ACTIONS
    private actionsWithMetaSource: Subject<ActionWithMeta> = new Subject();
    actions$: Actions = this.actionsWithMetaSource
        .asObservable()
        .pipe(map((actionWithMeta) => actionWithMeta.action));

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    state$: Observable<AppState> = this.stateSource.asObservable();

    // META REDUCERS
    private metaReducersSource: BehaviorSubject<MetaReducer<AppState>[]> = new BehaviorSubject([]);
    private combinedMetaReducer$: Observable<MetaReducer<AppState>> = this.metaReducersSource.pipe(
        map((metaReducers) => combineMetaReducers(metaReducers))
    );

    // REDUCER DICTIONARY
    private reducersSource: BehaviorSubject<ReducerDictionary> = new BehaviorSubject({});
    private get reducers() {
        return this.reducersSource.getValue();
    }
    private set reducers(reducers: ReducerDictionary) {
        this.reducersSource.next(reducers);
    }

    // COMBINED REDUCERS
    private combinedReducer$: Observable<Reducer<AppState>> = this.reducersSource.pipe(
        map((reducers) => combineReducers(Object.values(reducers)))
    );

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to the Actions Stream and update state accordingly
        this.actionsWithMetaSource
            .pipe(
                observeOn(queueScheduler),
                withLatestFrom(
                    this.state$,
                    this.combinedReducer$,
                    this.reducersSource,
                    this.combinedMetaReducer$
                ),
                tap(
                    ([
                        actionWithMeta,
                        state,
                        combinedReducer,
                        reducerDictionary,
                        combinedMetaReducer,
                    ]: [
                        ActionWithMeta,
                        AppState,
                        Reducer<AppState>,
                        ReducerDictionary,
                        MetaReducer<AppState>
                    ]) => {
                        const onlyForFeature: string =
                            actionWithMeta.meta && actionWithMeta.meta.onlyForFeature;
                        const action: Action = actionWithMeta.action;

                        let reducer: Reducer<AppState>;
                        if (onlyForFeature) {
                            // FeatureStore setState Actions only have to go through their own (default) reducer
                            reducer = reducerDictionary[onlyForFeature];
                        } else {
                            reducer = combinedReducer;
                        }

                        const reducerWithMetaReducers: Reducer<AppState> = combinedMetaReducer(
                            reducer
                        );
                        const newState: AppState = reducerWithMetaReducers(state, action);
                        this.updateState(newState);
                    }
                )
            )
            .subscribe();
    }

    addMetaReducers(...reducers: MetaReducer<AppState>[]) {
        this.metaReducersSource.next([...this.metaReducersSource.getValue(), ...reducers]);
    }

    addFeature<StateType>(
        featureName: string,
        reducer: Reducer<StateType>,
        config: {
            isDefaultReducer?: boolean;
            metaReducers?: MetaReducer<StateType>[];
            initialState?: StateType;
        } = {}
    ) {
        const { isDefaultReducer, metaReducers, initialState } = config;

        reducer =
            metaReducers && metaReducers.length > 0
                ? combineMetaReducers<StateType>(metaReducers)(reducer)
                : reducer;

        checkFeatureExists(featureName, this.reducers);

        if (typeof initialState !== 'undefined') {
            reducer = createReducerWithInitialState(reducer, initialState);
        }

        const actionTypePrefix = createActionTypePrefix(featureName);
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, reducer);

        // Add reducer
        this.reducers = {
            ...this.reducers,
            [featureName]: featureReducer,
        };

        // Dispatch an initial action to let reducers create the initial state
        const onlyForFeature: string = isDefaultReducer ? featureName : undefined;
        this.dispatch(
            {
                type: `${actionTypePrefix}/init`,
            },
            { onlyForFeature } // Dispatch only for the feature´s own reducer (in case of using a FeatureStore with default reducer)
        );
    }

    config(config: Partial<StoreConfig> = {}) {
        if (config.metaReducers && config.metaReducers.length > 0) {
            this.addMetaReducers(...config.metaReducers);
        }

        if (config.extensions && config.extensions.length > 0) {
            const sortedExtensions: StoreExtension[] = sortExtensions(config.extensions);
            sortedExtensions.forEach((extension) => this.addExtension(extension));
        }

        if (config.reducers) {
            Object.keys(config.reducers).forEach((featureName) => {
                checkFeatureExists(featureName, this.reducers);
                const featureReducer: Reducer<AppState> = createFeatureReducer(
                    featureName,
                    config.reducers[featureName]
                );

                this.reducers = {
                    ...this.reducers,
                    [featureName]: featureReducer,
                };
            });
        }

        this.updateState(config.initialState);

        this.dispatch({ type: storeInitActionType });
    }

    effect(effect$: Observable<Action>) {
        const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
        effectWithErrorHandler$.subscribe((action) => this.dispatch(action));
    }

    dispatch = (action: Action, meta?: ActionMetaData) =>
        this.actionsWithMetaSource.next({
            action,
            meta,
        });

    updateState(state: AppState) {
        this.stateSource.next(state);
    }

    select<K>(mapFn: (state: AppState) => K): Observable<K> {
        return this.state$.pipe(select(mapFn));
    }

    addExtension(extension: StoreExtension) {
        extension.init();
        this.extensions.push(extension);
    }
}

function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<AppState> {
    return (state: AppState, action: Action): AppState => {
        const newFeatureState: any = reducer(state[featureName], action);
        if (newFeatureState !== state[featureName]) {
            // Only return a new AppState if the feature state changed
            return {
                ...state,
                [featureName]: newFeatureState,
            };
        }
        return state;
    };
}

function createReducerWithInitialState<StateType>(
    reducer: Reducer<StateType>,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        return reducer(state, action);
    };
}

function checkFeatureExists(featureName: string, reducers: ReducerDictionary) {
    if (reducers.hasOwnProperty(featureName)) {
        miniRxError(`Feature "${featureName}" already exists.`);
    }
}

function sortExtensions(extensions: StoreExtension[]): StoreExtension[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}

// Created once to initialize singleton
export default new StoreCore();
