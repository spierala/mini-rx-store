import { Injectable } from '@angular/core';
import { FeatureStore, InstantiationMode } from 'mini-rx-store';
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
export class ArtStateService extends FeatureStore<any> {
    opacity$: Observable<number> = this.select((state) => state.count / 10);

    constructor() {
        super('counterFs', getInitialState(), {
            instantiation: InstantiationMode.MULTIPLE_DETACHED,
        });
    }

    // Update state with `setState`
    dec() {
        this.setState((state) => ({ count: 0 }));
    }
}
