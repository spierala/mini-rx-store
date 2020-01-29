import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action } from './mini-store.utils';
import { distinctUntilChanged, map, publishReplay, refCount, scan, share, switchMap, tap } from 'rxjs/operators';

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
    reducer: (state: StateType, action: ActionType) => StateType
  ) {
    const currentState = this.stateSource.getValue();
    if (!currentState.hasOwnProperty(featureName)) {

      // Initialize feature state
      currentState[featureName] = {};

      // Create Feature Store instance
      const featureStore: FeatureStore<StateType, ActionType> = new FeatureStore(featureName, reducer, this.updateState.bind(this));
      this.featureStores.push(featureStore);
    }
    // TODO throw if feature already exists
  }

  addEffects(effects: Observable<Action>[]) {
    this.effects$.next([...this.effects$.getValue(), ...effects]);
  }
}

class FeatureStore<StateType, ActionType extends Action> {

    constructor(
        featureName: string,
        reducer: (state: StateType, action: ActionType) => StateType,
        updateStateFn: (state: StateType, featureName: string) => void
    ) {
        const updateFn = updateStateFn;

        if (featureName && reducer) {
            console.log('MINI STORE READY', featureName); // TODO remove

            actions$.pipe(
                tap((action => console.log(featureName.toUpperCase(), 'Action: ', action.type, action.payload))), // TODO remove
                scan<ActionType, StateType>(reducer, undefined),
                distinctUntilChanged(),
                tap(newState => {
                    console.log(featureName.toUpperCase(), 'New State: ', newState); // TODO remove
                    updateFn(newState, featureName);
                })
            ).subscribe(); // TODO get rid of subscription?
        }
    }

    // TODO Add clean up logic ?
}

// Created once to initialize singleton
export const MiniStore = new MiniStoreBase();
export const actions$ = MiniStore.actions$;
