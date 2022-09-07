import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosShellComponent } from './components/todos-shell/todos-shell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodosSharedModule } from '../todos-shared/todos-shared.module';
import { TodosRoutingModule } from './todos-routing.module';

@NgModule({
    declarations: [TodosShellComponent],
    imports: [
        TodosRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TodosSharedModule,
    ],
})
export class TodosModule {}
