import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtShellComponent } from './components/counter-shell/art-shell.component';
import { PixelArtComponent } from './components/counter/pixel-art.component';

@NgModule({
    declarations: [ArtShellComponent, PixelArtComponent],
    exports: [ArtShellComponent],
    imports: [CommonModule],
})
export class ArtModule {}
