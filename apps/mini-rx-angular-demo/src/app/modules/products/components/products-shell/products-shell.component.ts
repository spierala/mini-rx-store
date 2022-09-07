import { Component } from '@angular/core';
import { ProductStore } from '../../state/product-store.service';
import { UserStore } from '../../../user/state/user-store.service';

@Component({
    selector: 'app-products',
    templateUrl: './products-shell.component.html',
    styleUrls: ['./products-shell.component.css'],
})
export class ProductsShellComponent {
    constructor(public productStore: ProductStore, public userStore: UserStore) {}
}
