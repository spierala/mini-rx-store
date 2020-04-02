import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as productActions from './../../state/product.actions';
import { Product } from '../../product';
import { getCurrentProduct, getError, getProductById, getProducts } from '../../state';
import { Store } from 'mini-rx-store';
import { ProductStateService } from '../../state/product-state.service';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  productById$: Observable<Product>

  constructor(
      private productStateService: ProductStateService
  ) {

  }

  ngOnInit(): void {
    this.products$ = Store.select(getProducts);
    this.errorMessage$ = Store.select(getError);
    this.selectedProduct$ = Store.select(getCurrentProduct);

    // Demonstrate how to select state via the Feature API
    this.displayCode$ = this.productStateService.displayCode$;

    // Demonstrate selector with static parameter
    this.productById$ = Store.select(getProductById(1));
  }

  checkChanged(value: boolean): void {
    // Demonstrate how to change state without Action
    this.productStateService.setState({showProductCode: value}, 'showProductCode');
  }

  newProduct(): void {
    Store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    Store.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
      this.productStateService.deleteProductFn(product.id);
  }

  clearProduct(): void {
    Store.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    Store.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    Store.dispatch(new productActions.UpdateProduct(product));
  }
}
