import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsShellComponent } from './components/products-shell/products-shell.component';

const routes: Routes = [{ path: '', component: ProductsShellComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductsRoutingModule {}
