import { createComponentStore } from '@mini-rx/signal-store';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Signal } from '@angular/core';

const initialState = {
    opacity: 1,
};

@Injectable()
export class ArtStore {
    private cs = createComponentStore(initialState);
    opacity: Signal<number> = this.cs.select((state) => state.opacity);

    constructor() {
        const delayedOpacity$: Observable<number> = timer(Math.random() * 5000).pipe(
            map(() => Math.random())
        );

        // You could use JS setTimeout, but that approach would require some cleanup code to cancel the timer when the component destroys
        // `connect` with Observable manages cleanup (of subscriptions) internally
        this.cs.connect({ opacity: delayedOpacity$ });
    }

    reset() {
        this.cs.setState(initialState);
    }
}
