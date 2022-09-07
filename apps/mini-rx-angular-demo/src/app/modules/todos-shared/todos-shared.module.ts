import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFilterComponent } from './components/todo-filter/todo-filter.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TodoFilterComponent, TodoListComponent, TodoDetailComponent],
    exports: [TodoListComponent, TodoDetailComponent, TodoFilterComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TodosSharedModule {}
