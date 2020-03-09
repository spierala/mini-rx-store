export interface AppState {
    [key: string]: string;
}

export interface MiniStoreExtension {
    init(): void;
}

export interface Action<PayLoadType = any> {
    type: string;
    payload?: any;
}

export interface Settings {
    enableLogging: boolean;
}
