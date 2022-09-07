import { Component } from '@angular/core';
import { ProductsStore } from '../../state/products-store.service';
import { UserStore } from '../../../user/state/user-store.service';

@Component({
    selector: 'app-products',
    templateUrl: './products-shell.component.html',
    styleUrls: ['./products-shell.component.css'],
})
export class ProductsShellComponent {
    constructor(public productStore: ProductsStore, public userStore: UserStore) {}
}
