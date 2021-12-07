import { BehaviorSubject, Observable, queueScheduler, Subject } from 'rxjs';
import {
    Action,
    Actions,
    AppState,
    MetaReducer,
    Reducer,
    ReducerDictionary,
    StoreConfig,
    StoreExtension,
} from './models';
import { observeOn } from 'rxjs/operators';
import { combineMetaReducers, createMiniRxAction, miniRxError, omit, select, } from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { combineReducers } from './combine-reducers';

class StoreCore {
    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Actions = this.actionsSource.asObservable();

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    state$: Observable<AppState> = this.stateSource.asObservable();
    get state(): AppState {
        return  this.stateSource.getValue();
    }

    // META REDUCERS
    private metaReducers: MetaReducer<AppState>[] = [];
    private combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(this.metaReducers);

    // FEATURE REDUCERS DICTIONARY
    private reducers: ReducerDictionary<AppState> = {};

    // FEATURE REDUCERS COMBINED
    private combinedReducer: Reducer<AppState> = combineReducers(this.reducers);

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to the Actions Stream and update state accordingly
        this.actions$
            .pipe(
                observeOn(queueScheduler),
            )
            .subscribe(
                (action) => {
                    const reducer: Reducer<AppState> = this.combinedMetaReducer(this.combinedReducer);
                    const newState: AppState = reducer(this.state, action);
                    this.updateState(newState);
                }
            );
    }

    addMetaReducers(...reducers: MetaReducer<AppState>[]) {
        this.metaReducers = [...this.metaReducers, ...reducers];
        this.combinedMetaReducer = combineMetaReducers(this.metaReducers);
    }

    addFeature<StateType>(
        featureKey: string,
        reducer: Reducer<StateType>,
        config: {
            metaReducers?: MetaReducer<StateType>[];
            initialState?: StateType;
        } = {}
    ) {
        reducer =
            config.metaReducers && config.metaReducers.length
                ? combineMetaReducers<StateType>(config.metaReducers)(reducer)
                : reducer;

        checkFeatureExists(featureKey, this.reducers);

        if (typeof config.initialState !== 'undefined') {
            reducer = createReducerWithInitialState(reducer, config.initialState);
        }

        this.addReducer(featureKey, reducer);
        this.dispatch(createMiniRxAction( 'init-feature', featureKey));
    }

    removeFeature(featureKey: string) {
        this.removeReducer(featureKey);
        this.dispatch(createMiniRxAction('destroy-feature', featureKey));
    }

    config(config: Partial<StoreConfig<AppState>> = {}) {
        if (Object.keys(this.reducers).length) {
            miniRxError(
                '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
            );
        }

        if (config.metaReducers && config.metaReducers.length) {
            this.addMetaReducers(...config.metaReducers);
        }

        if (config.extensions && config.extensions.length) {
            const sortedExtensions: StoreExtension[] = sortExtensions(config.extensions);
            sortedExtensions.forEach((extension) => this.addExtension(extension));
        }

        if (config.reducers) {
            Object.keys(config.reducers).forEach((featureKey) => {
                checkFeatureExists(featureKey, this.reducers);
                this.addReducer(featureKey, config.reducers[featureKey]);
            });
        }

        if (config.initialState) {
            this.updateState(config.initialState);
        }

        this.dispatch(createMiniRxAction('init-store'));
    }

    effect(effect$: Observable<Action>) {
        const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
        effectWithErrorHandler$.subscribe((action) => this.dispatch(action));
    }

    dispatch(action: Action) {
        this.actionsSource.next(action);
    }

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

    private addReducer(featureKey: string, reducer: Reducer<any>) {
        this.reducers[featureKey] = reducer;
        this.combinedReducer = combineReducers(this.reducers);
    }

    private removeReducer(featureKey: string) {
        this.reducers = omit(this.reducers, featureKey);
        this.combinedReducer = combineReducers(this.reducers);
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

// Created once to initialize singleton
export default new StoreCore();
