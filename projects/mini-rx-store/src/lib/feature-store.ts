import {distinctUntilChanged, scan, tap} from 'rxjs/operators';
import {Action} from './mini-store.utils';
import { actions$, MiniStore } from './mini-store-base';
import { Observable } from 'rxjs';

export class FeatureStore<StateType, ActionType extends Action> {

  constructor(
    featureName: string,
    reducer: (state: StateType, action: ActionType) => StateType,
    effects?: Observable<Action>[]
  ) {
    if (featureName && reducer) {
      MiniStore.addFeature(featureName);
      console.log('MINI STORE READY', featureName); // TODO remove

      actions$.pipe(
        tap((action => console.log(featureName.toUpperCase(), 'Action: ', action.type, action.payload))), // TODO remove
        scan<ActionType, StateType>(reducer, undefined),
        distinctUntilChanged(),
        tap(newState => {
          console.log(featureName.toUpperCase(), 'New State: ', newState); // TODO remove
          MiniStore.updateState(newState, featureName);
        })
      ).subscribe(); // TODO get rid of subscription?
    }

    if (effects) {
      MiniStore.addEffects(effects);
    }
  }

  // TODO protected? could be nice for using stateService as facade - pure components
  dispatch = (action: ActionType) => MiniStore.dispatch(action);

  // TODO protected? could be nice for using stateService as facade - pure components
  select = (mapFn: ((state: any) => any)) => MiniStore.select(mapFn);

  // TODO Add clean up logic ?
}
