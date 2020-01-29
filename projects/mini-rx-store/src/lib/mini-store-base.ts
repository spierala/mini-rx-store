import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Action } from './mini-store.utils';
import { distinctUntilChanged, map, publishReplay, refCount, share, switchMap, tap } from 'rxjs/operators';

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

  constructor() {
    this.effectActions.pipe(
      tap(action => this.dispatch(action))
    ).subscribe();
  }

  // TODO remove from public MiniStore API, should only be used by FeatureStore
  updateState(state, featureName) {
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

  addFeature(featureName: string) {
    const currentState = this.stateSource.getValue();
    if (!currentState.hasOwnProperty(featureName)) {
      currentState[featureName] = {};
    }
    // TODO throw if feature already exists
  }

  addEffects(effects: Observable<Action>[]) {
    this.effects$.next([...this.effects$.getValue(), ...effects]);
  }
}

// Created once to initialize singleton
export const MiniStore = new MiniStoreBase();
export const actions$ = MiniStore.actions$;
