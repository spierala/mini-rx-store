import { Component } from '@angular/core';
import { ProductStore } from '../../../products/state/product-store.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart-shell.component.html',
    styleUrls: ['./cart-shell.component.css'],
})
export class CartShellComponent {
    constructor(public productStore: ProductStore) {}
}
