import { queueScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { Action, Actions } from './models';

export class ActionsOnQueue {
    private actionsSource = new Subject<Action>();
    actions$: Actions = this.actionsSource.asObservable().pipe(
        observeOn(queueScheduler) // Prevent stack overflow: https://blog.cloudboost.io/so-how-does-rx-js-queuescheduler-actually-work-188c1b46526e
    );

    dispatch(action: Action) {
        this.actionsSource.next(action);
    }
}
