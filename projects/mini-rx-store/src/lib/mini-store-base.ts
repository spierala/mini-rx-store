import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { createFeatureSelector, ofType } from './mini-store.utils';
import {
    distinctUntilChanged,
    map,
    publishReplay,
    refCount,
    scan,
    share,
    switchMap,
    tap,
    withLatestFrom
} from 'rxjs/operators';
import { Action, AppState, MiniStoreExtension, SetStateAction, Settings } from './interfaces';

type Reducer<StateType> = (state: StateType, action: Action) => StateType;
type SetStateFn<StateType> = (state: StateType) => StateType;

class MiniStoreBase {

    // COMBINED REDUCER
    private reducerSource: Subject<Reducer<any>> = new Subject();
    private combinedReducer$: Observable<Reducer<AppState>> = this.reducerSource.pipe(
        scan<Reducer<any>, Reducer<AppState>>((acc, reducer) => {
            if (acc) {
                return combineReducers([acc, reducer]);
            }
            return reducer;
        })
    );

    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Observable<Action> = this.actionsSource.asObservable().pipe(
        share()
    );

    // EFFECTS
    private effectsSource: BehaviorSubject<Observable<Action>[]> = new BehaviorSubject([]);
    private effectActions$: Observable<Action> = this.effectsSource.pipe(
        switchMap(effects => merge(...effects)),
    );

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    private state$: Observable<AppState> = this.stateSource.pipe(
        publishReplay(1),
        refCount()
    );

    // FEATURE STATES
    private features: Map<string, MiniFeature<any>> = new Map();

    // SETTINGS
    // tslint:disable-next-line:variable-name
    private _settings: Partial<Settings>;
    private defaultSettings: Settings = {
        enableLogging: false,
    };

    set settings(settings: Partial<Settings>) {
        if (this._settings) {
            // Set settings only once
            console.warn(`MiniStore settings are already set.`);
            return;
        }

        this._settings = {
            ...this.defaultSettings,
            ...settings
        };
    }

    get settings(): Partial<Settings> {
        return this._settings ? this._settings : this.defaultSettings;
    }

    // EXTENSIONS
    private extensions: MiniStoreExtension[] = [];

    constructor() {
        // Listen to Actions which are emitted by Effects
        this.effectActions$.pipe(
            tap(action => this.dispatch(action))
        ).subscribe();

        // Listen to the Actions Stream and update state accordingly
        this.actions$.pipe(
            withLatestFrom(this.combinedReducer$),
            scan((acc, [action, reducer]: [Action, Reducer<AppState>]) => {
                const state = reducer(acc, action);
                this.log({action, state});
                return state;
            }, {}),
            tap(state => {
                this.stateSource.next(state);
            }),
        ).subscribe();
    }

    dispatch = (action: Action) => this.actionsSource.next(action);

    select(mapFn: ((state: AppState) => any)) {
        return this.state$.pipe(
            map((state: AppState) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    feature<StateType>(
        featureName: string,
        initialState: StateType = {} as StateType,
        reducer?: Reducer<StateType>
    ): MiniFeature<StateType> {

        if (!this.features.has(featureName)) {
            // Create Feature Store instance
            const feature: MiniFeature<StateType> = new MiniFeature(featureName, initialState, reducer, this.reducerSource);
            this.features.set(featureName, feature);
        } else {
            console.warn(`Feature "${featureName}" already exists.`);
        }
        return this.features.get(featureName);
    }

    effects(effects: Observable<Action>[]) {
        this.effectsSource.next([...this.effectsSource.getValue(), ...effects]);
    }

    addExtension(extension: MiniStoreExtension) {
        extension.init(this.stateSource, this.state$, this.actions$);
        this.extensions.push(extension);
    }

    private log({action, state}) {
        if (this.settings.enableLogging) {
            console.log(
                '%cACTION', 'font-weight: bold; color: #ff9900',
                '\nType:', action.type, '\nPayload: ', action.payload, '\nState: ', state
            );
        }
    }
}

export class MiniFeature<StateType> {

    private state$: Observable<StateType>;
    SetStateAction: new(setStateFn: SetStateFn<StateType>) => Action<StateType>;

    constructor(
        private featureName: string,
        initialState: StateType,
        reducer: Reducer<StateType>,
        reducerSource: Subject<Reducer<any>>
    ) {
        // Feature State
        this.state$ = MiniStore.select(createFeatureSelector(featureName));

        // Create Default Action and Reducer for Update Feature State (needed for setState())
        const updateActionType = `@mini-rx/feature/update/${featureName}`;
        this.SetStateAction = class {
            type = updateActionType;
            constructor(public setStateFn: SetStateFn<StateType>) {}
        };
        const defaultReducer: Reducer<StateType> = createDefaultReducer(updateActionType);

        // Combine feature and default reducer
        const reducers: Reducer<StateType>[] = reducer ? [defaultReducer, reducer] : [defaultReducer];
        const combinedReducer: Reducer<StateType> = combineReducers(reducers);
        // Add initial state to combined reducer
        const combinedReducerWithInitialState: Reducer<StateType> = createReducerWithInitialState(combinedReducer, initialState);
        // The reducer must know its feature to reduce feature state only...
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, combinedReducerWithInitialState);

        // Add reducer to MiniStore
        reducerSource.next(featureReducer);
        // Dispatch an initial action to let reducers create the initial state
        MiniStore.dispatch({type: `@mini-rx/feature/${featureName}/init`});
    }

    setState(setStateFn: SetStateFn<StateType>) {
        MiniStore.dispatch(new this.SetStateAction(setStateFn))
    }

    select(mapFn: ((state: StateType) => any)) {
        return this.state$.pipe(
            map((state: StateType) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    createMiniEffect<PayLoadType>(
        effectName: string,
        effectPipeFn: (payload: Observable<PayLoadType>) => Observable<Action>
    ) {
        const effectStartActionType = `@mini-rx/feature/${this.featureName}/mini-effect/${effectName}`;
        const EffectStartAction = class {
            type = effectStartActionType;
            constructor(public payload: PayLoadType) {}
        };

        let newEffect: Observable<Action> = actions$.pipe(
            ofType(effectStartActionType),
            map((action) => action.payload),
            effectPipeFn
        );

        MiniStore.effects([newEffect]);

        return (payload: PayLoadType) => {
            MiniStore.dispatch(new EffectStartAction(payload));
        }
    }
}

function createDefaultReducer<StateType>(type: string): Reducer<StateType> {
    return (state: StateType, action: SetStateAction<StateType>) => {
        if (action.type === type) {
            return {
                ...state,
                ...action.setStateFn(state)
            };
        }
        return state;
    };
}

function createReducerWithInitialState<StateType>(reducer: Reducer<StateType>, initialState: StateType): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        state = state === undefined ? initialState : state;
        return reducer(state, action);
    };
}

function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<AppState> {
    return (state: AppState, action: Action): AppState => {
        return {
            ...state,
            [featureName]: reducer(state[featureName], action)
        };
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
