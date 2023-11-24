import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { createArtStore } from '../../state/art-store.service';

@Component({
    selector: 'app-pixel-art',
    templateUrl: './pixel-art.component.html',
    styleUrls: ['./pixel-art.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelArtComponent {
    artStore = createArtStore();

    @HostListener('mouseover', ['$event']) onHover(e: MouseEvent) {
        this.artStore.reset();
    }
}
