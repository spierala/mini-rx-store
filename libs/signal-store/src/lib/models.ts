import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Action, StateOrCallback } from '@mini-rx/common';

export interface ComponentStoreLike<StateType> {
    update(stateOrCallback: StateOrCallback<StateType>, name?: string): void;
    state: Signal<StateType>;
    rxEffect(effectFn: (origin$: Observable<any>) => Observable<any>): () => void;
    undo(action: Action): void;
}
