import { Component } from '@angular/core';
import { ProductStateService } from '../../state/product-state.service';
import { UserStateService } from '../../../user/state/user-state.service';

@Component({
    selector: 'app-products',
    templateUrl: './products-shell.component.html',
    styleUrls: ['./products-shell.component.css'],
})
export class ProductsShellComponent {
    constructor(public productState: ProductStateService, public userState: UserStateService) {}
}
