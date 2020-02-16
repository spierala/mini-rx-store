import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action, AppState, createFeatureSelector, MiniFeature, Reducer, Settings } from './mini-store.utils';
import {
    distinctUntilChanged,
    map,
    publishReplay,
    refCount,
    scan,
    share,
    startWith,
    switchMap,
    tap,
    withLatestFrom
} from 'rxjs/operators';
import { AngularDevToolsExtension } from './angular/angular-devtools-extension';

const win = window as any;

class MiniStoreBase {

    private angularExtension: AngularDevToolsExtension;
    private devtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    private devtoolsConnection: any;

    // COMBINED REDUCER
    private reducerSource: Subject<Reducer<any>> = new Subject();
    private combinedReducer: Reducer<any>;

    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Observable<Action> = this.actionsSource.asObservable().pipe(
        share()
    );

    // EFFECTS
    private effects$: BehaviorSubject<Observable<Action>[]> = new BehaviorSubject([]);
    private effectActions: Observable<Action> = this.effects$.pipe(
        switchMap(effects => merge(...effects)),
    );

    private stateFromDevToolsSource: Subject<AppState> = new Subject();

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    private state$: Observable<AppState> = merge(this.stateFromDevToolsSource, this.stateSource).pipe(
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
        return this._settings;
    }

    constructor(

    ) {
        // Redux Dev Tools
        if (this.devtoolsExtension) {
            this.devtoolsConnection = win.__REDUX_DEVTOOLS_EXTENSION__.connect();

            this.devtoolsConnection.subscribe(message => {
                if (message.type === 'DISPATCH' && message.payload && (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION')) {
                    if (this.angularExtension) {
                        console.log('Dev Tools State', message.state);
                        this.angularExtension.runInZone(() => this.stateFromDevToolsSource.next(JSON.parse(message.state)));
                        return;
                    }
                }
            });

            win.addEventListener('DOMContentLoaded', () => {
                if (win.ng) {
                    this.angularExtension = new AngularDevToolsExtension();
                }
            });
        }

        this.reducerSource.pipe(
            scan<Reducer<any>>((acc, reducer) => {
                if (acc) {
                    return combineReducers([acc, reducer])
                }
                return reducer;
            }),
            tap(red => {
                this.combinedReducer = red;
            })
        ).subscribe();

        this.effectActions.pipe(
            tap(action => this.dispatch(action))
        ).subscribe();

        this.actions$.pipe(
            startWith({}),
            scan((acc: AppState, action: Action) => {
                const newState = this.combinedReducer(acc, action);
                if (this.devtoolsConnection) {
                    this.devtoolsConnection.send(action.type, newState);
                }
                if (this._settings.enableLogging) {
                    console.log(
                        '%cACTION', 'font-weight: bold; color: #ff9900',
                        '\nType:', action.type, '\nPayload: ', action.payload, '\nState: ', newState);
                }
                return newState;
            }),
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
            const feature: MiniFeature<StateType> = new Feature(featureName, initialState, reducer);
            this.features.set(featureName, feature);
        } else {
            console.warn(`Feature "${featureName}" already exists.`);
        }
        return this.features.get(featureName);
    }

    effects(effects: Observable<Action>[]) {
        this.effects$.next([...this.effects$.getValue(), ...effects]);
    }

    addReducer(reducer: Reducer<any>) {
        this.reducerSource.next(reducer);
    }
}

export class Feature<StateType> implements MiniFeature<StateType> {

    private readonly UpdateFeatureState: new(payload: StateType) => Action;
    private stateFnSource: Subject<(state: StateType) => StateType> = new Subject();

    state$: Observable<StateType>;

    constructor(
        private featureName: string,
        initialState: StateType,
        reducer: Reducer<StateType>,
    ) {
        this.state$ = MiniStore.select(createFeatureSelector(featureName));

        // Create Default Action and Reducer for Update Feature State (used for setState)
        const updateActionType = `@mini-rx/feature/update/${featureName}`;
        this.UpdateFeatureState = class {
            type = updateActionType;
            constructor(public payload: StateType) {}
        };
        const defaultReducer: Reducer<StateType> = createDefaultReducer(updateActionType);

        // Combine feature and default reducer
        const reducers: Reducer<StateType>[] = reducer ? [defaultReducer, reducer] : [defaultReducer];
        const combinedReducer: Reducer<StateType> = combineReducers(reducers);
        const combinedReducerWithInitialState: Reducer<StateType> = createReducerWithInitialState(combinedReducer, initialState);
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, combinedReducerWithInitialState);

        MiniStore.addReducer(featureReducer);
        MiniStore.dispatch({type: `@mini-rx/feature/init/${featureName}`});

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

function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<any> {
    return (state: AppState, action: Action): AppState => {
        return {
            ...state,
            [featureName]: reducer(state[featureName], action)
        };
    };
}

function createReducerWithInitialState<StateType>(reducer: Reducer<StateType>, initialState: any): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        state = state === undefined ? initialState : state;
        return reducer(state, action);
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
