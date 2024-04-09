import { Observable } from 'rxjs';
import {
    Action,
    StoreExtension,
    StateOrCallback,
    MetaReducer,
    ReducerDictionary,
} from '@mini-rx/common';

export type AppState = Record<string, any>;

export interface HasComponentStoreSupport {
    hasCsSupport: true;

    init(): MetaReducer<any>;
}

export type ComponentStoreExtension = StoreExtension & HasComponentStoreSupport;

export interface ComponentStoreConfig {
    extensions: ComponentStoreExtension[];
}

export interface ActionWithPayload extends Action {
    payload?: any;
}

export interface StoreConfig<T> {
    reducers?: ReducerDictionary<T>;
    initialState?: T;
    metaReducers?: MetaReducer<AppState>[];
    extensions?: StoreExtension[];
}

// Used for the Redux API: Store.feature / StoreModule.forFeature
export interface FeatureConfig<StateType> {
    initialState: StateType;
    metaReducers?: MetaReducer<StateType>[];
}

export type SetStateParam<T> = StateOrCallback<T> | Observable<Partial<T>>;
export type SetStateReturn<T, P extends SetStateParam<T>> = P extends Observable<Partial<T>>
    ? void
    : Action;

export interface ComponentStoreLike<StateType> {
    setInitialState(initialState: StateType): void;
    setState(stateOrCallback: SetStateParam<StateType>, name?: string): void;
    get state(): StateType;
    select(mapFn?: any): Observable<any>;
    effect(effectFn: (origin$: Observable<any>) => Observable<any>): () => void;
    undo(action: Action): void;
    destroy(): void;
}
