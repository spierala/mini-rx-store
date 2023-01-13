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

        const delayedClear$: Observable<ArtState> = timer(Math.random() * 5000).pipe(
            take(1),
            map(() => ({ opacity: Math.random() }))
        );

        this.setState(delayedClear$);
    }

    reset() {
        this.setState(initialState);
    }
}
