import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterShellComponent } from './counter-shell/counter-shell.component';
import { CounterComponent } from './counter/counter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [CounterShellComponent, CounterComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CounterModule {}
