import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, AppState, MiniStoreExtension, Reducer, Settings } from './interfaces';
import {
    concatMap,
    distinctUntilChanged,
    map,
    mergeAll,
    publishReplay,
    refCount,
    scan,
    share,
    tap,
    withLatestFrom
} from 'rxjs/operators';
import { combineReducers } from './mini-store.utils';
import { MiniFeature } from './mini-feature';

class MiniStoreCore {
    // FEATURE STATES
    features: Map<string, MiniFeature<any>> = new Map();

    // ACTIONS
    private actionsSource: Subject<Action> = new Subject();
    actions$: Observable<Action> = this.actionsSource.asObservable().pipe(
        share()
    );

    // EFFECTS
    private effectsSource$$: BehaviorSubject<Observable<Action>[]> = new BehaviorSubject([]);
    private effectActions$: Observable<Action> = this.effectsSource$$.pipe(
        concatMap(x => x), // Emit each array item separately
        mergeAll() // Merge the effects into one single stream of (effect) actions
    );

    // APP STATE
    private stateSource: BehaviorSubject<AppState> = new BehaviorSubject({}); // Init App State with empty object
    state$: Observable<AppState> = this.stateSource.pipe(
        publishReplay(1),
        refCount()
    );

    // COMBINED REDUCER
    private reducerSource: Subject<Reducer<any>> = new Subject();
    combinedReducer$: Observable<Reducer<AppState>> = this.reducerSource.pipe(
        scan<Reducer<any>, Reducer<AppState>>((acc, reducer) => {
            if (acc) {
                return combineReducers([acc, reducer]);
            }
            return reducer;
        })
    );

    // SETTINGS
    // tslint:disable-next-line:variable-name
    private _settings: Partial<Settings>;
    private defaultSettings: Settings = {
        enableLogging: false,
    };

    set settings(settings: Partial<Settings>) {
        if (this._settings) {
            // Set settings only once
            console.warn(`MiniRx: MiniStore settings are already set.`);
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
                this.updateState(state);
            }),
        ).subscribe();
    }

    addFeatureReducer(reducer: Reducer<any>) {
        this.reducerSource.next(reducer);
    }

    addEffects(effects: Observable<Action>[]) {
        this.effectsSource$$.next(effects);
    }

    dispatch = (action: Action) => this.actionsSource.next(action);

    updateState(state: AppState) {
        this.stateSource.next(state)
    }

    select(mapFn: ((state: AppState) => any)) {
        return this.state$.pipe(
            map((state: AppState) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    addExtension(extension: MiniStoreExtension) {
        extension.init();
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

// Created once to initialize singleton
export default new MiniStoreCore();
