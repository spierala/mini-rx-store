import { Injectable, Signal } from '@angular/core';
import { createComponentStore } from '@mini-rx/signal-store';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

interface ArtState {
    opacity: number;
}

const initialState: ArtState = {
    opacity: 1,
};

@Injectable()
export class ArtStore {
    private cs = createComponentStore(initialState);
    opacity: Signal<number> = this.cs.select((state) => state.opacity);

    constructor() {
        // This Observable is passed to setState: therefore the Observable has to emit ArtState
        // FYI: the typing of setState would also allow Observable<Partial<ArtState>>
        const delayedOpacity$: Observable<number> = timer(Math.random() * 5000).pipe(
            map(() => Math.random())
        );

        // You could use JS setTimeout, but that approach would require some cleanup code to cancel the timer when the component destroys
        // setState with Observable manages cleanup (of subscriptions) internally
        this.cs.connect({ opacity: delayedOpacity$ });
    }

    reset() {
        this.cs.setState(initialState);
    }
}
