import { Action, AppState, Reducer, StoreExtension } from '../../models';
import StoreCore from '../../store-core';

export class CommandExtension extends StoreExtension {
    init(): void {
        console.log('CommandExtension initialising');

        StoreCore.addMetaReducers(commandMetaReducer);
    }
}

function commandMetaReducer(reducer: Reducer<AppState>): Reducer<AppState> {
    console.log('commandMetaReducer invoked');

    function newReducer(state: AppState, action: Action): AppState {
        return reducer(state, action);
    }

    return newReducer;
}
