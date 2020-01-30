import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action, createFeatureSelector } from './mini-store.utils';
import { distinctUntilChanged, map, publishReplay, refCount, scan, share, switchMap, tap } from 'rxjs/operators';
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
    this.effectActions.pipe(
      tap(action => this.dispatch(action))
    ).subscribe();
  }

  private updateState(state, featureName) {
    const currentState = this.stateSource.getValue();
    const newState = {
      ...currentState
    };
    newState[featureName] = state;
    this.stateSource.next(newState);
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
    reducer?: Reducer<StateType, ActionType>
  ): FeatureStore<StateType, ActionType> {
    const currentState = this.stateSource.getValue();
    if (!currentState.hasOwnProperty(featureName)) {

      // Initialize feature state
      currentState[featureName] = {};

      // Create Feature Store instance
      const featureStore: FeatureStore<StateType, ActionType> = new FeatureStore(featureName, reducer, this.updateState.bind(this));
      this.featureStores.push(featureStore);
      return featureStore;
    }
    // TODO throw if feature already exists
  }

  addEffects(effects: Observable<Action>[]) {
    this.effects$.next([...this.effects$.getValue(), ...effects]);
  }
}

export class FeatureStore<StateType, ActionType extends Action = any> {

    defaultActionClass: new(payload: any) => Action;
    state$: Observable<StateType>;

    constructor(
        featureName: string,
        featureReducer: Reducer<StateType, ActionType>,
        updateStateFn: (state: StateType, featureName: string) => void
    ) {

        this.state$ =  MiniStore.select(createFeatureSelector(featureName));

        const updateActionType = `UPDATE_FEATURE_${featureName.toUpperCase()}`;

        this.defaultActionClass = class {
            type = updateActionType;
            constructor(public payload: StateType) { }
        };

        const defaultReducer: Reducer<StateType, ActionType> = createDefaultReducer(updateActionType);
        const reducers: Reducer<StateType, ActionType>[] = [defaultReducer];

        if (featureReducer) {
            reducers.push(featureReducer);
        }

        const combinedReducer: Reducer<StateType, ActionType> = combineReducers(reducers)

        if (featureName) {
            console.log('MINI STORE READY', featureName); // TODO remove

            actions$.pipe(
                tap((action => console.log(featureName.toUpperCase(), 'Action: ', action.type, 'PayLoad', action.payload))), // TODO remove
                scan<ActionType, StateType>(combinedReducer, undefined),
                distinctUntilChanged(),
                tap(newState => {
                    console.log(featureName.toUpperCase(), 'New State: ', newState); // TODO remove
                    updateStateFn(newState, featureName);
                })
            ).subscribe(); // TODO get rid of subscription?
        }
    }

    setState(state: StateType) {
        MiniStore.dispatch(new this.defaultActionClass(state));
    }

    // TODO Add clean up logic ?
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
