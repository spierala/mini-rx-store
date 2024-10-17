import { Observable } from 'rxjs';
import { Action, StateOrCallback } from '@mini-rx/common';

export interface ActionWithPayload extends Action {
    payload?: any;
}

export type SetStateParam<T> = StateOrCallback<T> | Observable<Partial<T>>;

export interface ComponentStoreLike<StateType> {
    get state(): StateType;
    setState(stateOrCallback: SetStateParam<StateType>, name?: string): void;
    setInitialState(initialState: StateType): void;
    connect(dict: Record<string, Observable<unknown>>): void;
    effect(effectFn: (origin$: Observable<unknown>) => Observable<unknown>): () => void;
    select(mapFn?: (state: unknown) => unknown): Observable<unknown>;
    undo(action: Action): void;
    destroy(): void;
}
