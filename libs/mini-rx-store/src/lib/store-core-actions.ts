// ACTIONS
import { ActionsOnQueue } from './actions-on-queue';
import { Actions } from './models';

export const actionsOnQueue = new ActionsOnQueue();
export const actions$: Actions = actionsOnQueue.actions$;
