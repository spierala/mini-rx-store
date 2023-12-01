import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createFeatureStore } from '@mini-rx/signal-store';

const initialState = {
    count: 42,
};

function createCounterStore() {
    const { setState, select } = createFeatureStore('counter', initialState, { multi: true });
    return {
        count: select((state) => state.count),
        increment: () => {
            setState(({ count }) => ({ count: count + 1 }), 'inc');
        },
        decrement() {
            setState(({ count }) => ({ count: count - 1 }), 'dec');
        },
    };
}

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
    counterStore = createCounterStore();
}
