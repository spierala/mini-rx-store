export interface AppState {
    [key: string]: string;
}

export interface StoreExtension {
    init(): void;
}

export interface Action<PayLoadType = any> {
    type: string;
    payload?: any;
}

export interface Settings {
    enableLogging: boolean;
}

export type Reducer<StateType> = (state: StateType, action: Action) => StateType;
