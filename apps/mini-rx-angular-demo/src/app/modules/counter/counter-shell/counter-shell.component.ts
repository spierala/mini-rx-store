import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-counter-shell',
    templateUrl: './counter-shell.component.html',
    styleUrls: ['./counter-shell.component.css'],
    host: { class: 'h-75 d-flex justify-content-around align-items-center' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterShellComponent {}
