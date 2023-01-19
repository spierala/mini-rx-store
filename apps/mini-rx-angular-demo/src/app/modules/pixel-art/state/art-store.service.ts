import { Injectable } from '@angular/core';
import { ComponentStore } from 'mini-rx-store';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

interface ArtState {
    opacity: number;
}

const initialState: ArtState = {
    opacity: 1,
};

@Injectable()
export class ArtStoreService extends ComponentStore<ArtState> {
    opacity$: Observable<number> = this.select((state) => state.opacity);

    constructor() {
        super(initialState);

        const delayedOpacity$: Observable<ArtState> = timer(Math.random() * 5000).pipe(
            take(1),
            map(() => ({ opacity: Math.random() }))
        );

        // You could use JS setTimeout, but that approach would require some cleanup code to cancel the timer when the component destroys
        // setState with Observable manages cleanup (of subscriptions) internally
        this.setState(delayedOpacity$);
    }

    reset() {
        this.setState(initialState);
    }
}
