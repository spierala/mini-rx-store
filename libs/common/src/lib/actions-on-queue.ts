import { observeOn, queueScheduler, Subject } from 'rxjs';
import { Action } from './models';

export function createActionsOnQueue() {
    const actionsSource = new Subject<Action>();

    return {
        actions$: actionsSource.asObservable().pipe(
            observeOn(queueScheduler) // Prevent stack overflow: https://blog.cloudboost.io/so-how-does-rx-js-queuescheduler-actually-work-188c1b46526e
        ),
        dispatch: <T extends Action>(action: T): T => {
            actionsSource.next(action);
            return action;
        },
    };
}
