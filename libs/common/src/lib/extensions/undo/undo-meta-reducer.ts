import { Action, MetaReducer, Reducer } from '../../models';
import { UNDO_ACTION } from './undo';

export function createUndoMetaReducer(bufferSize: number): MetaReducer<any> {
    let executedActions: Array<Action> = [];
    let initialState: any;

    return (rootReducer: Reducer<any>): Reducer<any> => {
        return (state: any, action: any) => {
            if (action.type === UNDO_ACTION) {
                // if the action is UNDO_ACTION,
                // then call all the actions again on the rootReducer,
                // except the one we want to rollback
                let newState: any = initialState;
                executedActions = executedActions.filter((eAct) => eAct !== action.payload);
                // update the state for every action until we get the
                // exact same state as before, but without the action we want to rollback
                executedActions.forEach((executedAction) => {
                    newState = rootReducer(newState, executedAction);
                });
                return newState;
            } else {
                // push every action that isn't UNDO_ACTION
                executedActions.push(action);
            }
            const updatedState = rootReducer(state, action);
            if (executedActions.length === bufferSize + 1) {
                const firstAction = executedActions[0];
                // calculate the state x (bufferSize) actions ago
                initialState = rootReducer(initialState, firstAction);
                // keep the correct actions
                executedActions = executedActions.slice(1, bufferSize + 1);
            }
            return updatedState;
        };
    };
}
