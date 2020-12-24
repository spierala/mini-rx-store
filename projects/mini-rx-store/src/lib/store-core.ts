import { BehaviorSubject, Observable, queueScheduler, Subject } from 'rxjs';
import {
    Action,
    ActionMetaData,
    ActionWithMeta,
    AppState,
    MetaReducer,
    Reducer,
    ReducerDictionary,
    StoreExtension,
} from './interfaces';
import {
    catchError,
    distinctUntilChanged,
    map,
    mergeAll,
    observeOn,
    scan,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { combineReducers, combineMetaReducers, createActionTypePrefix } from './utils';

class StoreCore {
    // ACTIONS
    private actionsWithMetaSource: Subject<ActionWithMeta> = new Subject();
    actions$: Observable<Action> = this.actionsWithMetaSource
        .asObservable()
        .pipe(map((actionWithMeta) => actionWithMeta.action));

    // EFFECTS
    private effectsSource: Subject<Observable<Action>> = new Subject();
    private effects$: Observable<Action> = this.effectsSource.pipe(
        mergeAll() // Merge the effects into one single stream of (effect) actions
    );

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

    // COMBINED REDUCERS
    private combinedReducer$: Observable<Reducer<AppState>> = this.reducersSource.pipe(
        map((reducers) => combineReducers(Object.values(reducers)))
    );

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to Actions which are emitted by Effects and dispatch
        this.effects$.pipe(tap((action) => this.dispatch(action))).subscribe();

        // Listen to the Actions Stream and update state accordingly
        this.actionsWithMetaSource
            .pipe(
                observeOn(queueScheduler),
                withLatestFrom(
                    this.combinedReducer$,
                    this.reducersSource,
                    this.combinedMetaReducer$
                ),
                scan(
                    (
                        state,
                        [actionWithMeta, combinedReducer, reducerDictionary, combinedMetaReducer]: [
                            ActionWithMeta,
                            Reducer<AppState>,
                            ReducerDictionary,
                            MetaReducer<AppState>
                        ]
                    ) => {
                        const forFeature: string =
                            actionWithMeta.meta && actionWithMeta.meta.onlyForFeature;
                        const action: Action = actionWithMeta.action;

                        let reducer: Reducer<AppState>;
                        if (forFeature) {
                            // Feature setState Actions only have to go through their own feature reducer
                            reducer = reducerDictionary[forFeature];
                        } else {
                            reducer = combinedReducer;
                        }

                        const reducerWithMetaReducers: Reducer<AppState> = combinedMetaReducer(
                            reducer
                        );
                        return reducerWithMetaReducers(state, action);
                    },
                    {}
                ),
                tap((state: AppState) => {
                    this.updateState(state);
                })
            )
            .subscribe();
    }

    addMetaReducer(reducer: MetaReducer<AppState>) {
        this.metaReducersSource.next([...this.metaReducersSource.getValue(), reducer]);
    }

    addFeature<StateType>(
        featureName: string,
        reducer: Reducer<StateType>,
        extra: {
            isDefaultReducer?: boolean;
        } = {}
    ) {
        const reducers = this.reducersSource.getValue();
        const { isDefaultReducer } = extra;

        // Check if feature already exists
        if (reducers.hasOwnProperty(featureName)) {
            throw new Error(`MiniRx: Feature "${featureName}" already exists.`);
        }

        const actionTypePrefix = createActionTypePrefix(featureName);
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, reducer);

        // Add reducer
        this.reducersSource.next({
            ...reducers,
            [featureName]: featureReducer,
        });

        // Dispatch an initial action to let reducers create the initial state
        const onlyForFeature: string = isDefaultReducer ? featureName : undefined;
        this.dispatch(
            {
                type: `${actionTypePrefix}/INIT`,
            },
            { onlyForFeature } // Dispatch only for the feature reducer (in case of using a defaultReducer)
        );
    }

    createEffect(effect$: Observable<Action>) {
        const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
        this.effectsSource.next(effectWithErrorHandler$);
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
        return this.state$.pipe(
            map((state: AppState) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    addExtension(extension: StoreExtension) {
        extension.init();
        this.extensions.push(extension);
    }
}

function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<AppState> {
    return (state: AppState, action: Action): AppState => {
        return {
            ...state,
            [featureName]: reducer(state[featureName], action),
        };
    };
}

// Prevent effect to unsubscribe from the actions stream
// Credits: NgRx: https://github.com/ngrx/platform/blob/9.2.0/modules/effects/src/effects_error_handler.ts
const MAX_NUMBER_OF_RETRY_ATTEMPTS = 10;
function defaultEffectsErrorHandler<T extends Action>(
    observable$: Observable<T>,
    retryAttemptLeft: number = MAX_NUMBER_OF_RETRY_ATTEMPTS
): Observable<T> {
    return observable$.pipe(
        catchError((error) => {
            if (retryAttemptLeft <= 1) {
                return observable$; // last attempt
            }
            // Return observable that produces this particular effect
            return defaultEffectsErrorHandler(observable$, retryAttemptLeft - 1);
        })
    );
}

// Created once to initialize singleton
export default new StoreCore();
