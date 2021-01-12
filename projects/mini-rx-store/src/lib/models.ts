import { Observable } from 'rxjs';

export interface AppState {
    [key: string]: any;
}

export interface StoreExtension {
    init(): void;
}

export interface Action {
    type: string;
    payload?: any;
}

export interface ActionMetaData {
    onlyForFeature: string;
}

export interface ActionWithMeta {
    action: Action;
    meta: ActionMetaData;
}

export interface StoreConfig {
    reducers: ReducerDictionary;
    metaReducers: MetaReducer<AppState>[];
    extensions: StoreExtension[];
}

export interface FeatureStoreConfig<StateType> {
    metaReducers?: MetaReducer<StateType>[];
}

export class Actions extends Observable<Action> {}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;

export type MetaReducer<StateType> = (reducer: Reducer<any>) => Reducer<StateType>;

export type ReducerDictionary = { [key: string]: Reducer<any> };
