import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as productActions from './../../state/product.actions';
import { Product } from '../../product';
import { getCurrentProduct, getError, getProducts } from '../../state';
import { MiniStore } from 'mini-rx-store';
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

  constructor(
      private productStateService: ProductStateService
  ) {

  }

  ngOnInit(): void {
    this.products$ = MiniStore.select(getProducts);
    this.errorMessage$ = MiniStore.select(getError);
    this.selectedProduct$ = MiniStore.select(getCurrentProduct);

    // Demonstrate how to select state via the MiniFeature API
    this.displayCode$ = this.productStateService.select(state => state.showProductCode);
  }

  checkChanged(value: boolean): void {
    // Demonstrate how to change state without Action
    this.productStateService.setState({showProductCode: value});
  }

  newProduct(): void {
    MiniStore.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    MiniStore.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
      this.productStateService.deleteProductFn(product.id);
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
