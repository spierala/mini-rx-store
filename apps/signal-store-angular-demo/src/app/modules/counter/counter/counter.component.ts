import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CounterStore } from '../state/counter-store.service';
import { createComponentStore, createFeatureStore } from '@mini-rx/signal-store';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const initialState = { counter: 1 };

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
    providers: [CounterStore], // The CounterStore is provided for each counter component instance
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
    counter: Signal<number> = this.counterStore.count;

    testCs = createFeatureStore('bla', initialState, { multi: true });
    testCsCount = this.testCs.select((state) => state.counter);

    constructor(private counterStore: CounterStore) {
        this.testCs.update(
            timer(0, 1000).pipe(
                tap((v) => console.log('counter')),
                map((v) => ({ counter: v }))
            )
        );
    }

    increment() {
        this.testCs.update((state) => ({ counter: state.counter + 1 }));
    }

    decrement() {
        this.testCs.update((state) => ({ counter: state.counter - 1 }));
    }
}
