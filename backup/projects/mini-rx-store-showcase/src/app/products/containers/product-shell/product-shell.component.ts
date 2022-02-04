import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../product';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    templateUrl: './product-shell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent {
    displayCode$: Observable<boolean> = this.productState.displayCode$;
    selectedProduct$: Observable<Product> = this.productState.selectedProduct$;
    products$: Observable<Product[]> = this.productState.products$;
    errorMessage$: Observable<string> = this.productState.errorMessage$;

    constructor(private productState: ProductStateService) {}

    checkChanged(value: boolean): void {
        this.productState.showProductCode(value);
    }

    newProduct(): void {
        this.productState.initializeCurrentProduct();
    }

    productSelected(product: Product): void {
        this.productState.setCurrentProduct(product.id);
    }

    deleteProduct(product: Product): void {
        this.productState.deleteProduct(product.id);
    }

    clearProduct(): void {
        this.productState.clearCurrentProduct();
    }

    saveProduct(product: Product): void {
        this.productState.createProduct(product);
    }

    updateProduct(product: Product): void {
        this.productState.updateProduct(product);
    }
}
