import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action, createFeatureSelector } from './mini-store.utils';
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
type Reducer<StateType, ActionType> = (state: StateType, action: ActionType) => StateType;

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

  // State
  private stateSource: BehaviorSubject<any> = new BehaviorSubject({});
  private state$: Observable<any> = this.stateSource.asObservable().pipe(
    publishReplay(1),
    refCount()
  );

  private featureStores: FeatureStore<any, Action>[] = [];

  constructor() {
    console.log('MINI STORE INIT'); // TODO remove

    this.effectActions.pipe(
      tap(action => this.dispatch(action))
    ).subscribe();
  }

  private updateFeatureState(featureState, featureName) {
    const state = this.stateSource.getValue();
    state[featureName] = featureState;
    this.stateSource.next(state);
  }

  dispatch = (action: Action) => this.actionsSource.next(action);

  select(mapFn: ((state: any) => any)) {
    return this.state$.pipe(
      map(state => mapFn(state)),
      distinctUntilChanged()
    );
  }

  addFeature<StateType, ActionType extends Action>(
    featureName: string,
    initialState: StateType = {} as StateType,
    reducer?: Reducer<StateType, ActionType>
  ): FeatureStore<StateType, ActionType> {

    const currentState = this.stateSource.getValue();

    if (!currentState.hasOwnProperty(featureName)) {
      // Create Feature Store instance
      const featureStore: FeatureStore<StateType, ActionType> = new FeatureStore(featureName, initialState, reducer, this.updateFeatureState.bind(this));
      this.featureStores.push(featureStore);
      return featureStore;
    } else {
        console.warn(`Feature "${featureName}" already exists`);
        // TODO throw error ?
        // TODO return existing Feature Instance?
    }
  }

  addEffects(effects: Observable<Action>[]) {
    this.effects$.next([...this.effects$.getValue(), ...effects]);
  }
}

export class FeatureStore<StateType, ActionType extends Action = any> { // TODO rename to FeatureState? Feature?

    private readonly UpdateFeatureState: new(payload: StateType) => Action;
    private stateFnSource: Subject<(state: StateType) => StateType> = new Subject(); // TODO better name

    state$: Observable<StateType>;

    constructor(
        featureName: string,
        initialState: StateType,
        featureReducer: Reducer<StateType, ActionType>,
        updateFeatureStateFn: (state: StateType, featureName: string) => void,
    ) {

        console.log('FEATURE STORE INIT', featureName); // TODO remove

        this.state$ =  MiniStore.select(createFeatureSelector(featureName));

        // Create Default Action and Reducer for Update Feature State (used for setState)
        const updateActionType = `UPDATE_FEATURE_${featureName.toUpperCase()}`;
        this.UpdateFeatureState = class {
            type = updateActionType;
            constructor(public payload: StateType) { }
        };
        const defaultReducer: Reducer<StateType, ActionType> = createDefaultReducer(updateActionType);

        // Combine reducers
        const reducers: Reducer<StateType, ActionType>[] = featureReducer ? [defaultReducer, featureReducer] : [defaultReducer];
        const combinedReducer: Reducer<StateType, ActionType> = combineReducers(reducers);

        // Listen to the actions stream let the reducers update the state
        actions$.pipe(
            tap((action => console.log(featureName.toUpperCase(), 'Action: ', action.type, 'PayLoad', action.payload))),
            startWith(initialState),
            scan<ActionType, StateType>(combinedReducer),
            distinctUntilChanged(),
            tap(newState => {
                console.log(featureName.toUpperCase(), 'New State: ', newState); // TODO remove
                updateFeatureStateFn(newState, featureName);
            })
        ).subscribe(); // TODO get rid of subscription?

        this.stateFnSource.pipe(
            withLatestFrom(this.state$),
            map(([setStateFn, state]) => {
                return setStateFn(state);
            }),
            tap((newState) => MiniStore.dispatch(new this.UpdateFeatureState(newState)))
        ).subscribe();
    }

    setState(stateFn: (state: StateType) => StateType) {
        this.stateFnSource.next(stateFn)
    }
}

function createDefaultReducer<ActionType extends Action, StateType>(type: string): Reducer<StateType, ActionType> {
    return (state= {} as StateType, action: ActionType) => {
        if (action.type === type) {
            return {
                ...state,
                ...action.payload
            };
        }
        return state;
    };
}

function combineReducers<StateType, ActionType>(reducers: Reducer<StateType, ActionType>[]): Reducer<StateType, ActionType> {
    return (state, action: ActionType): StateType => {
        return reducers.reduce((currState, reducer) => {
            return reducer(currState, action);
        }, state);
    };
}

// Created once to initialize singleton
export const MiniStore = new MiniStoreBase();
export const actions$ = MiniStore.actions$;
