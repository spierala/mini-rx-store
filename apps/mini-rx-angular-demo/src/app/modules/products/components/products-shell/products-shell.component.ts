import { Component, OnInit } from '@angular/core';
import { ProductStateService } from '../../state/product-state.service';
import { UserStateService } from '../../../user/state/user-state.service';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'app-products',
    templateUrl: './products-shell.component.html',
    styleUrls: ['./products-shell.component.css'],
})
export class ProductsShellComponent implements OnInit {
    detailTitle$: Observable<string> = this.productState.selectedProduct$.pipe(
        withLatestFrom(this.userState.permissions$),
        map(([product, permissions]) => {
            if (permissions.canUpdateProducts) {
                return product && product.id ? 'Edit Product' : 'Create Product';
            }
            return 'View Product';
        })
    );

    constructor(public productState: ProductStateService, public userState: UserStateService) {}

    ngOnInit(): void {}
}
