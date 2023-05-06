import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelArtShellComponent } from './components/pixel-art-shell/pixel-art-shell.component';
import { PixelArtComponent } from './components/pixel-art/pixel-art.component';

@NgModule({
    declarations: [PixelArtShellComponent, PixelArtComponent],
    exports: [PixelArtShellComponent],
    imports: [CommonModule],
})
export class PixelArtModule {}
