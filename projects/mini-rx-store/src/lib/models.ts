import { Observable } from 'rxjs';

export enum ExtensionSortOrder {
    DEFAULT,
    // The Undo Extension Meta Reducer should be the last one to be executed before "normal" reducers (for performance)
    // Reason: The Undo Extension Meta Reducers may send many Actions through all following Reducers to undo an Action
    // Also, we want to prevent that the replay of Actions shows up e.g. in the LoggerExtension Meta Reducer
    UNDO_EXTENSION
}

export interface AppState {
    [key: string]: any;
}

export abstract class StoreExtension {
    sortOrder: ExtensionSortOrder = ExtensionSortOrder.DEFAULT;

    abstract init(): void;
}

export interface Action {
    type: string;
    // Allows any extra properties to be defined in an action.
    [x: string]: any;
}

export interface ActionWithPayload extends Action {
    payload: any;
}

// tslint:disable-next-line:no-empty-interface
export interface ActionMetaData {
    // onlyForFeature: string;
}

export interface ActionWithMeta {
    action: Action;
    meta: ActionMetaData;
}

export interface StoreConfig {
    reducers: ReducerDictionary;
    initialState: AppState;
    metaReducers: MetaReducer<AppState>[];
    extensions: StoreExtension[];
}

export interface FeatureStoreConfig<StateType> {
    initialState: StateType;
    metaReducers?: MetaReducer<StateType>[];
}

export class Actions extends Observable<Action> {}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;

export type MetaReducer<StateType> = (reducer: Reducer<any>) => Reducer<StateType>;

export interface ReducerDictionary { [key: string]: Reducer<any>; }
