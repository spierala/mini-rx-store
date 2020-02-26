import { BehaviorSubject, Observable } from 'rxjs';

export interface AppState {
    [key: string]: string;
}

export interface MiniStoreExtension {
    init(
        stateSource: BehaviorSubject<AppState>,
        state$: Observable<AppState>,
        actions$: Observable<Action>
    ): void;
}

export interface Action<PayLoadType = any> {
    type: string;
    payload?: any;
}

export interface SetStateAction<StateType> {
    type: string;
    setStateFn: (state: StateType) => StateType;
}

export interface Settings {
    enableLogging: boolean;
}
