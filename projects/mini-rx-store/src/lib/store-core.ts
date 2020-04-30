import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
    Action,
    AppState,
    Reducer,
    Settings,
    StoreExtension,
} from './interfaces';
import {
    distinctUntilChanged,
    map,
    mergeAll,
    scan,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { combineReducers } from './utils';
import { FeatureBase, Feature } from './feature';

class StoreCore {
    // FEATURE STATES
    features: Map<string, FeatureBase<any>> = new Map();

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

    // COMBINED REDUCERS
    private reducerSource: Subject<Reducer<any>> = new Subject();
    combinedReducers$: Observable<Reducer<AppState>> = this.reducerSource.pipe(
        scan<Reducer<any>, Reducer<any>[]>((acc, reducer) => {
            return [...acc, reducer];
        }, []),
        map((reducers) => combineReducers(reducers))
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
            console.warn(`MiniRx: Settings are already set.`);
            return;
        }

        this._settings = {
            ...this.defaultSettings,
            ...settings,
        };
    }

    get settings(): Partial<Settings> {
        return this._settings ? this._settings : this.defaultSettings;
    }

    // EXTENSIONS
    private extensions: StoreExtension[] = [];

    constructor() {
        // Listen to Actions which are emitted by Effects
        this.effects$.pipe(tap((action) => this.dispatch(action))).subscribe();

        // Listen to the Actions Stream and update state accordingly
        this.actions$
            .pipe(
                withLatestFrom(this.combinedReducers$),
                scan((acc, [action, reducer]: [Action, Reducer<AppState>]) => {
                    const state = reducer(acc, action);
                    this.log({ action, state });
                    return state;
                }, {}),
                tap((state) => {
                    this.updateState(state);
                })
            )
            .subscribe();
    }

    addFeatureReducer(reducer: Reducer<any>) {
        this.reducerSource.next(reducer);
    }

    createEffect(effect: Observable<Action>) {
        this.effectsSource.next(effect);
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

    private log({ action, state }) {
        if (this.settings.enableLogging) {
            console.log(
                '%cACTION',
                'font-weight: bold; color: #ff9900',
                '\nType:',
                action.type,
                '\nPayload: ',
                action.payload,
                '\nState: ',
                state
            );
        }
    }
}

// Created once to initialize singleton
export default new StoreCore();
