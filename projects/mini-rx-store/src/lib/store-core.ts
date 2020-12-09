import { BehaviorSubject, combineLatest, Observable, queueScheduler, Subject } from 'rxjs';
import { Action, AppState, MetaReducer, Reducer, StoreExtension } from './interfaces';
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
import {
    combineReducers,
    combineReducerWithMetaReducers,
    createActionTypePrefix,
    nameUpdateAction,
} from './utils';

class StoreCore {
    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Observable<Action> = this.actionsSource.asObservable();

    // EFFECTS
    private effectsSource: Subject<Observable<Action>> = new Subject();
    private effects$: Observable<Action> = this.effectsSource.pipe(
        mergeAll() // Merge the effects into one single stream of (effect) actions
    );

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    state$: Observable<AppState> = this.stateSource.asObservable();

    // META REDUCERS
    private metaReducersSource: BehaviorSubject<MetaReducer<any>[]> = new BehaviorSubject([]);

    // REDUCERS
    private reducersSource: BehaviorSubject<{
        [key: string]: Reducer<any>;
    }> = new BehaviorSubject({});

    // COMBINED REDUCERS
    combinedReducer$: Observable<Reducer<AppState>> = combineLatest([
        this.reducersSource,
        this.metaReducersSource,
    ]).pipe(
        map(([reducers, metaReducers]) => {
            const combinedFeatureReducer: Reducer<AppState> = combineReducers(
                Object.values(reducers)
            );
            return metaReducers && metaReducers.length > 0
                ? combineReducerWithMetaReducers(combinedFeatureReducer, metaReducers)
                : combinedFeatureReducer;
        })
    );

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to Actions which are emitted by Effects
        this.effects$.pipe(tap((action) => this.dispatch(action))).subscribe();

        // Listen to the Actions Stream and update state accordingly
        this.actions$
            .pipe(
                observeOn(queueScheduler),
                withLatestFrom(this.combinedReducer$),
                scan((acc, [action, reducer]: [Action, Reducer<AppState>]) => {
                    const state = reducer(acc, action);
                    // this.log({ action, state });
                    return state;
                }, {}),
                tap((state) => {
                    this.updateState(state);
                })
            )
            .subscribe();
    }

    addMetaReducer(reducer: MetaReducer<any>) {
        this.metaReducersSource.next([...this.metaReducersSource.getValue(), reducer]);
    }

    addFeature<StateType>(
        featureName: string,
        initialState: StateType,
        reducer?: Reducer<StateType>
    ) {
        const reducers = this.reducersSource.getValue();

        // Check if feature already exists
        if (reducers.hasOwnProperty(featureName)) {
            throw new Error(`MiniRx: Feature "${featureName}" already exists.`);
        }

        const actionTypePrefix = createActionTypePrefix(featureName);

        reducer = reducer ? reducer : createDefaultReducer(actionTypePrefix);

        reducer = initialState ? createReducerWithInitialState(reducer, initialState) : reducer;

        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, reducer);

        // Add reducer
        this.reducersSource.next({
            ...reducers,
            [featureName]: featureReducer,
        });

        // Dispatch an initial action to let reducers create the initial state
        this.dispatch({ type: `${actionTypePrefix}/INIT` });
    }

    createEffect(effect$: Observable<Action>) {
        const effectWithErrorHandler$: Observable<Action> = defaultEffectsErrorHandler(effect$);
        this.effectsSource.next(effectWithErrorHandler$);
    }

    dispatch = (action: Action) => this.actionsSource.next(action);

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

function createDefaultReducer<StateType>(nameSpaceFeature: string): Reducer<StateType> {
    return (state: StateType, action: Action) => {
        // Check for 'set-state' (can originate from setState() or feature effect)
        if (
            action.type.indexOf(nameSpaceFeature) > -1 &&
            action.type.indexOf(nameUpdateAction) > -1
        ) {
            return {
                ...state,
                ...action.payload,
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
