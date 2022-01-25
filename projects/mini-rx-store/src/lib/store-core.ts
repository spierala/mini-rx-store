import { BehaviorSubject, combineLatest, Observable, queueScheduler, Subject } from 'rxjs';
import {
    Action,
    Actions,
    ActionWithPayload,
    AppState,
    MetaReducer,
    Reducer,
    ReducerDictionary,
    StoreConfig,
    StoreExtension,
} from './models';
import { map, observeOn, tap, withLatestFrom } from 'rxjs/operators';
import { combineMetaReducers, createMiniRxAction, miniRxError, omit, select } from './utils';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { combineReducers } from './combine-reducers';

type GroupedByFeatureReducers = Record<string, Record<string, Reducer<any>>>;

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

    private groupedByFeatureReducersSource: BehaviorSubject<GroupedByFeatureReducers> =
        new BehaviorSubject({});
    private groupedByFeatureReducers$: Observable<ReducerDictionary<AppState>> =
        this.groupedByFeatureReducersSource.pipe(
            tap((v) => {}),
            map((groupedByFeatureReducers) => {
                return Object.keys(groupedByFeatureReducers).reduce((previousValue, key) => {
                    return {
                        ...previousValue,
                        [key]: combineReducers(groupedByFeatureReducers[key]),
                    };
                }, {});
            })
        );

    private multiReducersCounters = {};

    // FEATURE REDUCERS COMBINED
    private combinedReducer$: Observable<Reducer<AppState>> = combineLatest([
        this.reducersSource,
        this.groupedByFeatureReducers$,
    ]).pipe(
        tap((v) => {}),
        map(([appReducers, groupedFeatureReducers]) =>
            combineReducers({ ...appReducers, ...groupedFeatureReducers })
        )
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
            config.metaReducers && config.metaReducers.length
                ? combineMetaReducers<StateType>(config.metaReducers)(reducer)
                : reducer;

        checkFeatureExists(featureKey, this.reducers);

        if (typeof config.initialState !== 'undefined') {
            reducer = createReducerWithInitialState(reducer, config.initialState);
        }

        this.addReducer(featureKey, reducer);
        this.dispatch(createMiniRxAction('init-feature', [featureKey]));
    }

    addFeatureStore<StateType>(
        featureKey: string,
        initialState?: StateType,
        multi?: boolean
    ): string[] {
        const featureExists = checkFeatureExists(featureKey, this.reducers);

        if (!multi && featureExists) {
            miniRxError(`Feature "${featureKey}" already exists.`);
        }

        const multiReducerKey: string[] = multi
            ? this.addMultiReducer(featureKey, initialState)
            : this.addReducer(featureKey, createFeatureReducer([featureKey], initialState));
        this.dispatch(createMiniRxAction('init-feature', multiReducerKey));
        return multiReducerKey;
    }

    removeFeature(featureKeys: string[]) {
        featureKeys.length > 1
            ? this.removeMultiReducer([featureKeys[0], featureKeys[1]])
            : this.removeReducer(featureKeys[0]);
        this.dispatch(createMiniRxAction('destroy-feature', featureKeys));
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

    private addReducer(featureKey: string, reducer: Reducer<any>): string[] {
        this.reducersSource.next({
            ...this.reducers,
            [featureKey]: reducer,
        });
        return [featureKey];
    }

    // private multiReducers: GroupedByFeatureReducers = {
    //     // if emit
    //     // go over all props of multiReducer
    //     // run combineReducer for each prop -> every prop has a reducer (similar to reducerSource)
    //     // combinedReducer$: merge reducerSource with multiReducersSource with combineLatest?
    //
    //     // Feature Store: adjust select feature state
    // }

    private addMultiReducer(featureKey: string, initialState: any): string[] {
        const groupedByFeatureReducers = this.groupedByFeatureReducersSource.getValue();

        let multiReducerKey: string;
        if (!groupedByFeatureReducers.hasOwnProperty(featureKey)) {
            groupedByFeatureReducers[featureKey] = {};
            multiReducerKey = featureKey + '-' + 1;
            this.multiReducersCounters[featureKey] = 1;
        } else {
            multiReducerKey = featureKey + '-' + (this.multiReducersCounters[featureKey] += 1);
        }
        groupedByFeatureReducers[featureKey][multiReducerKey] = createFeatureReducer(
            [featureKey, multiReducerKey],
            initialState
        );

        console.log('addMultiReducer', groupedByFeatureReducers);
        this.groupedByFeatureReducersSource.next(groupedByFeatureReducers);

        return [featureKey, multiReducerKey];
    }

    private removeReducer(featureKey: string) {
        this.reducersSource.next(omit(this.reducers, featureKey));
    }

    private removeMultiReducer([feature, multiReducerKey]) {
        const groupedByFeatureReducers = this.groupedByFeatureReducersSource.getValue();
        groupedByFeatureReducers[feature] = omit(
            groupedByFeatureReducers[feature],
            multiReducerKey
        );
        this.groupedByFeatureReducersSource.next(groupedByFeatureReducers);
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

function checkFeatureExists(featureKey: string, reducers: ReducerDictionary<AppState>): boolean {
    return reducers.hasOwnProperty(featureKey);
}

function sortExtensions(extensions: StoreExtension[]): StoreExtension[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}

function createFeatureReducer<StateType>(
    keys: string[],
    initialState: StateType
): Reducer<StateType> {
    const setStateAction: Action = createMiniRxAction('set-state', keys);
    return (state: StateType = initialState, action: ActionWithPayload): StateType => {
        if (action.type.indexOf(setStateAction.type) === 0) {
            return {
                ...state,
                ...action.payload,
            };
        }
        return state;
    };
}

// Created once to initialize singleton
export default new StoreCore();
