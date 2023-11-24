import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createCounterStore } from '../state/counter-store.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
    counterStore = createCounterStore();
}
