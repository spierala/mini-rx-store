import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as productActions from './../../state/product.actions';
import { Product } from '../../product';
import { getCurrentProduct, getError, getProducts, getShowProductCode } from '../../state';
import { MiniStore } from 'mini-rx-store';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  constructor(

  ) {

  }

  ngOnInit(): void {
    this.products$ = MiniStore.select(getProducts);
    this.errorMessage$ = MiniStore.select(getError);
    this.selectedProduct$ = MiniStore.select(getCurrentProduct);
    this.displayCode$ = MiniStore.select(getShowProductCode);
  }

  checkChanged(value: boolean): void {
    MiniStore.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    MiniStore.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    MiniStore.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    MiniStore.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    MiniStore.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    MiniStore.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    MiniStore.dispatch(new productActions.UpdateProduct(product));
  }
}
