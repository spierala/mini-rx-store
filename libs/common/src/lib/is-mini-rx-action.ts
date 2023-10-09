import { Action, MiniRxAction, StoreType } from './models';

const storeTypeKey: keyof MiniRxAction<any> = 'storeType';

// Type predicate
export function isMiniRxAction<StateType>(
    action: Action,
    storeType: StoreType
): action is MiniRxAction<StateType> {
    return action[storeTypeKey] === storeType;
}
