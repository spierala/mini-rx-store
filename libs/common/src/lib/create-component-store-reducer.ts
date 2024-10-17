import { Action, ComponentStoreExtension, MetaReducer, Reducer } from './models';
import { isMiniRxAction } from './is-mini-rx-action';
import { calcNextState } from './calc-next-state';
import { combineMetaReducers } from './combine-meta-reducers';

export function createComponentStoreReducer<StateType>(
    initialState: StateType,
    extensions: ComponentStoreExtension[]
): Reducer<StateType> {
    const reducer = (state: StateType = initialState, action: Action) => {
        return isMiniRxAction<StateType>(action)
            ? calcNextState(state, action.stateOrCallback)
            : state;
    };

    const metaReducers: MetaReducer<StateType>[] = extensions.map((ext) => ext.init());
    const combinedMetaReducer = combineMetaReducers(metaReducers);
    return combinedMetaReducer(reducer);
}
