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

export interface Action {
    type: string;
    payload?: any;
}

export interface MiniFeature<StateType> {
    setState: (mapFn: (state: StateType) => StateType) => void;
    select: (mapFn: (state: StateType) => any) => Observable<any>;
}

export interface Settings {
    enableLogging: boolean;
}
