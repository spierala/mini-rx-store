import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosSimpleShellComponent } from './components/todos-simple-shell/todos-simple-shell.component';

const routes: Routes = [{ path: '', component: TodosSimpleShellComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TodosSimpleRoutingModule {}
