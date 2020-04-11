import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  productById$: Observable<Product>;

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
    this.productStateService.initializeCurrentProduct();
  }

  productSelected(product: Product): void {
      this.productStateService.setCurrentProduct(product.id);
  }

  deleteProduct(product: Product): void {
      this.productStateService.deleteProductFn(product.id);
  }

  clearProduct(): void {
    this.productStateService.clearCurrentProduct();
  }
  saveProduct(product: Product): void {
    this.productStateService.createProductFn(product);
  }

  updateProduct(product: Product): void {
      this.productStateService.updateProductFn(product);
  }
}
