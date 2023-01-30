import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    templateUrl: './pixel-art-shell.component.html',
    styleUrls: ['./pixel-art-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelArtShellComponent {
    numSequence(n: number): Array<number> {
        return Array(n);
    }
}
