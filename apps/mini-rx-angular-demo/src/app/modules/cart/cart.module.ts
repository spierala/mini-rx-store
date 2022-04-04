import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartShellComponent } from './components/cart-shell/cart-shell.component';

@NgModule({
    declarations: [CartShellComponent],
    imports: [CommonModule, CartRoutingModule],
})
export class CartModule {}
