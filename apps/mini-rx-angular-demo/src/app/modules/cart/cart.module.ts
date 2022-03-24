import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartShellComponent } from './components/cart-shell/cart-shell.component';
import { ProductStateModule } from '../products/state/product-state.module';

@NgModule({
    declarations: [CartShellComponent],
    imports: [CommonModule, CartRoutingModule],
})
export class CartModule {}
