import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ArtStore } from '../../state/art-store.service';

@Component({
    selector: 'app-pixel-art',
    templateUrl: './pixel-art.component.html',
    styleUrls: ['./pixel-art.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ArtStore],
})
export class PixelArtComponent {
    artStore = inject(ArtStore);

    @HostListener('mouseover', ['$event']) onHover(e: MouseEvent) {
        this.artStore.reset();
    }
}
