import { Injectable } from '@angular/core';
import { Actions, createRxEffect, ofType, Store } from '@mini-rx/signal-store';
import { delay, map } from 'rxjs';

@Injectable()
export class TodoEffects {
    loadTodos$ = createRxEffect(
        this.actions$.pipe(
            ofType('fxStart'),
            delay(1000),
            map(() => {
                return {
                    type: 'fxSuccess',
                    payload: this.store.select()(),
                };
            })
        )
    );

    constructor(private actions$: Actions, private store: Store) {}
}
