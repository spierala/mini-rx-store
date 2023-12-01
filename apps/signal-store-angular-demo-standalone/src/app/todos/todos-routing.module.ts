import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosShellComponent } from './components/todos-shell/todos-shell.component';

const routes: Routes = [{ path: '', component: TodosShellComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TodosRoutingModule {}
