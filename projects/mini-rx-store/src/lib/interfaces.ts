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

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;

export type MetaReducer<StateType> = (reducer: Reducer<any>) => StateType;
