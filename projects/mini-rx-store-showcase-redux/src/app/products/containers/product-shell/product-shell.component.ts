import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromProduct from './../../state';
import {
    clearCurrentProduct,
    createProduct,
    deleteProduct,
    initializeCurrentProduct,
    load,
    setCurrentProduct,
    toggleProductCode,
    updateProduct,
} from './../../state/product.actions';
import { Product } from '../../product';
import { Store } from 'mini-rx-store';

@Component({
    templateUrl: './product-shell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent implements OnInit {
    displayCode$: Observable<boolean>;
    selectedProduct$: Observable<Product>;
    products$: Observable<Product[]>;
    errorMessage$: Observable<string>;

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(load());
        this.products$ = this.store.select(fromProduct.getProducts);
        this.errorMessage$ = this.store.select(fromProduct.getError);
        this.selectedProduct$ = this.store.select(fromProduct.getCurrentProduct);
        this.displayCode$ = this.store.select(fromProduct.getShowProductCode);
    }

    checkChanged(value: boolean): void {
        this.store.dispatch(toggleProductCode(value));
    }

    newProduct(): void {
        this.store.dispatch(initializeCurrentProduct());
    }

    productSelected(product: Product): void {
        this.store.dispatch(setCurrentProduct(product));
    }

    deleteProduct(product: Product): void {
        this.store.dispatch(deleteProduct(product.id));
    }

    clearProduct(): void {
        this.store.dispatch(clearCurrentProduct());
    }
    saveProduct(product: Product): void {
        this.store.dispatch(createProduct(product));
    }

    updateProduct(product: Product): void {
        this.store.dispatch(updateProduct(product));
    }
}
