import { Component } from '@angular/core';
import { ProductsStore } from '../../../products/state/products-store.service';

@Component({
    templateUrl: './cart-shell.component.html',
    styleUrls: ['./cart-shell.component.css'],
})
export class CartShellComponent {
    constructor(public productsStore: ProductsStore) {}
}
