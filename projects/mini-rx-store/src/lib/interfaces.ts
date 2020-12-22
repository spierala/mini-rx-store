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
    forFeature: string;
}

export interface ActionWithMeta {
    action: Action;
    meta: ActionMetaData;
}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;

export type MetaReducer<StateType> = (reducer: Reducer<any>) => Reducer<StateType>;

export type ReducerDictionary = { [key: string]: Reducer<any> };
