import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    templateUrl: './counter-shell.component.html',
    styleUrls: ['./counter-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterShellComponent {}
