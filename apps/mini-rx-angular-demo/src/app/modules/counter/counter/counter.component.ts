import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterStateService } from '../state/counter-state.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
    providers: [CounterStateService], // The CounterState is provided for each counter component instance
})
export class CounterComponent {
    counter$: Observable<number> = this.counterState.count$;

    constructor(private counterState: CounterStateService) {}

    increment() {
        this.counterState.increment();
    }

    decrement() {
        this.counterState.decrement();
    }
}
