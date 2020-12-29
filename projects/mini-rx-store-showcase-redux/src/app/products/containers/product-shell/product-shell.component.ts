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
import { store } from 'mini-rx-store';

@Component({
    templateUrl: './product-shell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent implements OnInit {
    displayCode$: Observable<boolean>;
    selectedProduct$: Observable<Product>;
    products$: Observable<Product[]>;
    errorMessage$: Observable<string>;

    constructor() {}

    ngOnInit(): void {
        store.dispatch(load());
        this.products$ = store.select(fromProduct.getProducts);
        this.errorMessage$ = store.select(fromProduct.getError);
        this.selectedProduct$ = store.select(fromProduct.getCurrentProduct);
        this.displayCode$ = store.select(fromProduct.getShowProductCode);
    }

    checkChanged(value: boolean): void {
        store.dispatch(toggleProductCode(value));
    }

    newProduct(): void {
        store.dispatch(initializeCurrentProduct());
    }

    productSelected(product: Product): void {
        store.dispatch(setCurrentProduct(product));
    }

    deleteProduct(product: Product): void {
        store.dispatch(deleteProduct(product.id));
    }

    clearProduct(): void {
        store.dispatch(clearCurrentProduct());
    }
    saveProduct(product: Product): void {
        store.dispatch(createProduct(product));
    }

    updateProduct(product: Product): void {
        store.dispatch(updateProduct(product));
    }
}
