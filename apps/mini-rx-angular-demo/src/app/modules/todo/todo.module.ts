import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoShellComponent } from './components/todo-shell/todo-shell.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { FilterComponent } from './components/filter/filter.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TodoShellComponent, TodoDetailComponent, FilterComponent, TodoListComponent],
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class TodoModule {}
