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
    createMiniRxActionType,
    miniRxError,
    omit,
    select,
    storeInitActionType,
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
    private reducersSource: BehaviorSubject<ReducerDictionary> = new BehaviorSubject({});
    private get reducers(): ReducerDictionary {
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
        featureName: string,
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

        checkFeatureExists(featureName, this.reducers);

        if (typeof config.initialState !== 'undefined') {
            reducer = createReducerWithInitialState(reducer, config.initialState);
        }

        this.addReducer(featureName, reducer);
        this.dispatch({ type: createMiniRxActionType(featureName, 'init') });
    }

    removeFeature(featureName: string) {
        this.removeReducer(featureName);
        this.dispatch({
            type: createMiniRxActionType(featureName, 'destroy'),
        });
    }

    config(config: Partial<StoreConfig> = {}) {
        if (Object.keys(this.reducers).length > 0) {
            miniRxError(
                '`configureStore` detected already registered reducers. Did you instantiate FeatureStores before calling `configureStore`?'
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
            Object.keys(config.reducers).forEach((featureName) => {
                checkFeatureExists(featureName, this.reducers);
                this.addReducer(featureName, config.reducers[featureName]);
            });
        }

        if (config.initialState) {
            this.updateState(config.initialState);
        }

        this.dispatch({ type: storeInitActionType });
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

    private addReducer(featureName: string, reducer: Reducer<any>) {
        const reducers = this.reducers;
        reducers[featureName] = reducer;
        this.reducersSource.next(reducers);
    }

    private removeReducer(featureName: string) {
        this.reducersSource.next(omit(this.reducers, featureName));
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
