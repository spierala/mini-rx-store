import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ArtStateService } from '../../service/art-state.service';

@Component({
    selector: 'app-pixel-art',
    templateUrl: './pixel-art.component.html',
    styleUrls: ['./pixel-art.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ArtStateService],
})
export class PixelArtComponent implements OnInit {
    @HostListener('mouseover', ['$event']) onHover(e: MouseEvent) {
        if (!e.altKey) {
            this.artState.dec();
        }
    }

    constructor(public artState: ArtStateService) {}

    ngOnInit(): void {}
}
