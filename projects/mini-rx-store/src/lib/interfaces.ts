export interface AppState {
    [key: string]: string;
}

export interface StoreExtension {
    init(): void;
}

export interface Action {
    type: string;
    payload?: any;
}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;
