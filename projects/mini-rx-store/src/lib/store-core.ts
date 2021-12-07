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
import { map, observeOn, withLatestFrom } from 'rxjs/operators';
import {
    combineMetaReducers,
    createMiniRxAction,
    miniRxError,
    omit,
    select,
} from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { combineReducers } from './combine-reducers';

class StoreCore {
    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Actions = this.actionsSource.asObservable();

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    state$: Observable<AppState> = this.stateSource.asObservable();

    // META REDUCERS
    private metaReducersSource: BehaviorSubject<MetaReducer<AppState>[]> = new BehaviorSubject([]);
    private combinedMetaReducer$: Observable<MetaReducer<AppState>> = this.metaReducersSource.pipe(
        map((metaReducers) => combineMetaReducers(metaReducers))
    );

    // FEATURE REDUCERS DICTIONARY
    private reducersSource: BehaviorSubject<ReducerDictionary<AppState>> = new BehaviorSubject({});
    private get reducers(): ReducerDictionary<AppState> {
        return this.reducersSource.getValue();
    }

    // FEATURE REDUCERS COMBINED
    private combinedReducer$: Observable<Reducer<AppState>> = this.reducersSource.pipe(
        map((reducers) => combineReducers(reducers))
    );

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to the Actions Stream and update state accordingly
        this.actions$
            .pipe(
                observeOn(queueScheduler),
                withLatestFrom(this.state$, this.combinedReducer$, this.combinedMetaReducer$)
            )
            .subscribe(
                ([action, state, combinedReducer, combinedMetaReducer]: [
                    Action,
                    AppState,
                    Reducer<AppState>,
                    MetaReducer<AppState>
                ]) => {
                    const reducer: Reducer<AppState> = combinedMetaReducer(combinedReducer);
                    const newState: AppState = reducer(state, action);
                    this.updateState(newState);
                }
            );
    }

    addMetaReducers(...reducers: MetaReducer<AppState>[]) {
        this.metaReducersSource.next([...this.metaReducersSource.getValue(), ...reducers]);
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
            config.metaReducers && config.metaReducers.length > 0
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
        if (Object.keys(this.reducers).length > 0) {
            miniRxError(
                '`configureStore` detected reducers. Did you instantiate FeatureStores before calling `configureStore`?'
            );
        }

        if (config.metaReducers && config.metaReducers.length > 0) {
            this.addMetaReducers(...config.metaReducers);
        }

        if (config.extensions && config.extensions.length > 0) {
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
        const reducers = this.reducers;
        reducers[featureKey] = reducer;
        this.reducersSource.next(reducers);
    }

    private removeReducer(featureKey: string) {
        this.reducersSource.next(omit(this.reducers, featureKey));
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
