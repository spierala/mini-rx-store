import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action, AppState, createFeatureSelector, Feature, Reducer } from './mini-store.utils';
import {
    distinctUntilChanged,
    map,
    publishReplay,
    refCount,
    scan,
    share, startWith,
    switchMap,
    tap,
    withLatestFrom
} from 'rxjs/operators';

class MiniStoreBase {

    // Actions
    private actionsSource: Subject<Action> = new Subject();
    actions$: Observable<Action> = this.actionsSource.asObservable().pipe(
        share()
    );

    // Effects
    private effects$: BehaviorSubject<Observable<Action>[]> = new BehaviorSubject([]);
    private effectActions: Observable<Action> = this.effects$.pipe(
        switchMap(effects => merge(...effects)),
    );

    // App State
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    private state$: Observable<AppState> = this.stateSource.asObservable().pipe(
        publishReplay(1),
        refCount()
    );

    // Features
    private features: Map<string, MiniFeature<any>> = new Map();

    constructor() {
        console.log('MINI STORE INIT'); // TODO remove

        this.effectActions.pipe(
            tap(action => this.dispatch(action))
        ).subscribe();
    }

    private updateFeatureState(featureName: string, featureState: any) {
        const state: AppState = this.stateSource.getValue();
        state[featureName] = featureState;
        this.stateSource.next(state);
    }

    dispatch = (action: Action) => this.actionsSource.next(action);

    select(mapFn: ((state: AppState) => any)) {
        return this.state$.pipe(
            map((state: AppState) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    addFeature<StateType>(
        featureName: string,
        initialState: StateType = {} as StateType,
        reducer?: Reducer<StateType>
    ): MiniFeature<StateType> {

        if (!this.features.has(featureName)) {
            // Create Feature Store instance
            const feature: MiniFeature<StateType> = new MiniFeature(featureName, initialState, reducer, this.updateFeatureState.bind(this));
            this.features.set(featureName, feature);
        } else {
            console.warn(`Feature "${featureName}" already exists`);
            // TODO throw error ?
        }
        return this.features.get(featureName);
    }

    addEffects(effects: Observable<Action>[]) {
        this.effects$.next([...this.effects$.getValue(), ...effects]);
    }
}

export class MiniFeature<StateType> implements Feature<StateType> {

    private readonly UpdateFeatureState: new(payload: StateType) => Action;
    private stateFnSource: Subject<(state: StateType) => StateType> = new Subject();

    state$: Observable<StateType>;

    constructor(
        featureName: string,
        initialState: StateType,
        featureReducer: Reducer<StateType>,
        updateFeatureStateFn: (featureName: string, state: StateType) => void
    ) {

        console.log('FEATURE STORE INIT', featureName); // TODO remove

        this.state$ = MiniStore.select(createFeatureSelector(featureName));

        // Create Default Action and Reducer for Update Feature State (used for setState)
        const updateActionType = `UPDATE_FEATURE_${featureName.toUpperCase()}`;
        this.UpdateFeatureState = class {
            type = updateActionType;

            constructor(public payload: StateType) {
            }
        };
        const defaultReducer: Reducer<StateType> = createDefaultReducer(updateActionType);

        // Combine reducers
        const reducers: Reducer<StateType>[] = featureReducer ? [defaultReducer, featureReducer] : [defaultReducer];
        const combinedReducer: Reducer<StateType> = combineReducers(reducers);

        // Listen to the actions stream, reducers update the state
        actions$.pipe(
            tap((action => console.log(featureName.toUpperCase(), 'Action: ', action.type, 'PayLoad', action.payload))),
            startWith(initialState),
            scan<Action, StateType>(combinedReducer),
            distinctUntilChanged(),
            tap(newState => {
                console.log(featureName.toUpperCase(), 'New State: ', newState); // TODO remove
                // Push the new feature state to the App State
                updateFeatureStateFn(featureName, newState);
            })
        ).subscribe();

        this.stateFnSource.pipe(
            withLatestFrom(this.state$),
            map(([setStateFn, state]) => {
                return setStateFn(state);
            }),
            tap((newState) => MiniStore.dispatch(new this.UpdateFeatureState(newState)))
        ).subscribe();
    }

    setState(stateFn: (state: StateType) => StateType) {
        this.stateFnSource.next(stateFn);
    }
}

function createDefaultReducer<StateType>(type: string): Reducer<StateType> {
    return (state: StateType, action: Action) => {
        if (action.type === type) {
            return {
                ...state,
                ...action.payload
            };
        }
        return state;
    };
}

function combineReducers<StateType, ActionType>(reducers: Reducer<StateType>[]): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}

// Created once to initialize singleton
export const MiniStore = new MiniStoreBase();
export const actions$ = MiniStore.actions$;
