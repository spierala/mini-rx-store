import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartShellComponent } from './components/cart-shell/cart-shell.component';

const routes: Routes = [{ path: '', component: CartShellComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CartRoutingModule {}
