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
    updateProduct
} from './../../state/product.actions';
import { Product } from '../../product';
import { Store } from 'mini-rx-store';


@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  constructor() {}

  ngOnInit(): void {
    Store.dispatch(load());
    this.products$ = Store.select(fromProduct.getProducts);
    this.errorMessage$ = Store.select(fromProduct.getError);
    this.selectedProduct$ = Store.select(fromProduct.getCurrentProduct);
    this.displayCode$ = Store.select(fromProduct.getShowProductCode);
  }

  checkChanged(value: boolean): void {
    Store.dispatch(toggleProductCode(value));
  }

  newProduct(): void {
    Store.dispatch(initializeCurrentProduct());
  }

  productSelected(product: Product): void {
    Store.dispatch(setCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    Store.dispatch(deleteProduct(product.id));
  }

  clearProduct(): void {
    Store.dispatch(clearCurrentProduct());
  }
  saveProduct(product: Product): void {
    Store.dispatch(createProduct(product));
  }

  updateProduct(product: Product): void {
    Store.dispatch(updateProduct(product));
  }
}
