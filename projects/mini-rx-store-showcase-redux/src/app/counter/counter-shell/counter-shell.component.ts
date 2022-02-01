import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from 'mini-rx-store';
import { Observable } from 'rxjs';
import { CounterState } from '../state/counter-state.service';

// Memoized selectors (FYI you can also use "normal selectors")
const getCounterFeatureGroup = createFeatureSelector<Record<string, CounterState>>('counter');
const getCounterStatesAsArray = createSelector(getCounterFeatureGroup, (featureGroup) =>
    Object.values(featureGroup)
);
const getCounterTotal = createSelector(getCounterStatesAsArray, (arr) => {
    return arr.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.count;
    }, 0);
});

@Component({
    selector: 'app-counter-shell',
    templateUrl: './counter-shell.component.html',
    styleUrls: ['./counter-shell.component.css'],
    host: { class: 'h-75 d-flex justify-content-around align-items-center' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterShellComponent {
    // Select state from the global state object via the Store instance
    total$: Observable<number> = this.store.select(getCounterTotal);

    constructor(private store: Store) {}
}
