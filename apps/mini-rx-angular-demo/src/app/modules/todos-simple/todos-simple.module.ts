import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodosSimpleRoutingModule } from './todos-simple-routing.module';
import { TodosSimpleShellComponent } from './components/todos-simple-shell/todos-simple-shell.component';
import { TodoSharedModule } from '../todo-shared/todo-shared.module';

@NgModule({
    declarations: [TodosSimpleShellComponent],
    imports: [CommonModule, TodosSimpleRoutingModule, TodoSharedModule],
})
export class TodosSimpleModule {}
