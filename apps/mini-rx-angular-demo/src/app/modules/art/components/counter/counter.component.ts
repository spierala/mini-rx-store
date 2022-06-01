import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { CounterStoreService } from '../../service/counter-store.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CounterStoreService],
})
export class CounterComponent implements OnInit {
    @HostListener('mouseover', ['$event']) onHover(e: MouseEvent) {
        if (!e.altKey) {
            this.store.dec();
        }
    }

    constructor(public store: CounterStoreService) {}

    ngOnInit(): void {}
}
