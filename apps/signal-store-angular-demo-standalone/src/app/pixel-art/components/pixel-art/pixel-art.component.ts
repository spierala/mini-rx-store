import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ArtStore } from '../../state/art-store.service';

@Component({
    selector: 'app-pixel-art',
    templateUrl: './pixel-art.component.html',
    styleUrls: ['./pixel-art.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ArtStore],
})
export class PixelArtComponent {
    artStore = inject(ArtStore);

    @HostListener('mouseover') onHover() {
        this.artStore.reset();
    }
}
