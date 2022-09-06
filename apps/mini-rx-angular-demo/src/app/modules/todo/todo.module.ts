import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoShellComponent } from './components/todo-shell/todo-shell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoSharedModule } from '../todo-shared/todo-shared.module';

@NgModule({
    declarations: [TodoShellComponent],
    imports: [FormsModule, ReactiveFormsModule, CommonModule, TodoSharedModule],
})
export class TodoModule {}
