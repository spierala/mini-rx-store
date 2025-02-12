import { Injectable } from '@angular/core';
import { ComponentStore } from 'mini-rx-store';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

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

        const delayedOpacity$: Observable<number> = timer(Math.random() * 5000).pipe(
            map(() => Math.random())
        );

        // You could use JS setTimeout, but that approach would require some cleanup code to cancel the timer when the component destroys
        // `connect` with Observable manages cleanup (of subscriptions) internally
        this.connect({ opacity: delayedOpacity$ });
    }

    reset() {
        this.setState(initialState);
    }
}
