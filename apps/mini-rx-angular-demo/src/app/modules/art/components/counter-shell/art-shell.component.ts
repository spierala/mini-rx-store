import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-counter-shell',
    templateUrl: './art-shell.component.html',
    styleUrls: ['./art-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtShellComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    numSequence(n: number): Array<number> {
        return Array(n);
    }
}
