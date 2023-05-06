import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodosSimpleRoutingModule } from './todos-simple-routing.module';
import { TodosSimpleShellComponent } from './components/todos-simple-shell/todos-simple-shell.component';
import { TodosSharedModule } from '../todos-shared/todos-shared.module';

@NgModule({
    declarations: [TodosSimpleShellComponent],
    imports: [CommonModule, TodosSimpleRoutingModule, TodosSharedModule],
})
export class TodosSimpleModule {}
