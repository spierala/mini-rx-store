import { Observable } from 'rxjs';
import { Action, StateOrCallback } from '@mini-rx/common';

export interface ActionWithPayload extends Action {
    payload?: any;
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
