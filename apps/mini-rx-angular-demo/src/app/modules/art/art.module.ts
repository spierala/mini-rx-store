import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtShellComponent } from './components/counter-shell/art-shell.component';
import { CounterComponent } from './components/counter/counter.component';

@NgModule({
    declarations: [ArtShellComponent, CounterComponent],
    exports: [ArtShellComponent],
    imports: [CommonModule],
})
export class ArtModule {}
