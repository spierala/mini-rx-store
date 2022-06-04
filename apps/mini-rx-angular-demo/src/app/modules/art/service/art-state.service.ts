import { Injectable } from '@angular/core';
import { SimpleStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

interface CounterState {
    count: number;
}

function getInitialState(): CounterState {
    return {
        count: Math.floor(Math.random() * 10) + 3,
    };
}

@Injectable()
export class ArtStateService extends SimpleStore<CounterState> {
    opacity$: Observable<number> = this.select((state) => state.count / 10);

    constructor() {
        super(getInitialState());
    }

    dec() {
        this.setState((state) => ({ count: 0 }));
    }
}
