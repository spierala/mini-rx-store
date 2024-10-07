import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createFeatureStore } from '@mini-rx/signal-store';

const initialState = {
    count: 42,
};

// FYI This is an alternative way to create a FeatureStore
// Of course you could extend FeatureStore in a service (as it is done in most examples) or use `createFeatureStore` directly in the component class
// The benefits of this approach are: a minimum amount of boilerplate, no use of `this`, encapsulation of the store logic
function createCounterStore() {
    const { setState, select } = createFeatureStore(
        'counter',
        initialState,
        { multi: true } // 'multi: true' to allow many instances of the feature store (using the same featureKey)
    );
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
    styleUrls: ['./counter.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
    counterStore = createCounterStore();
}
