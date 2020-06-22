import { Injectable } from '@angular/core';
import { Feature } from 'mini-rx-store';
import { ProductService } from '../product.service';
import { catchError, map, mapTo, mergeMap, startWith, withLatestFrom } from 'rxjs/operators';
import { Observable, of, pipe } from 'rxjs';
import { Product } from '../product';
import {
    getCurrentProduct,
    getError,
    getProducts,
    getShowProductCode,
    initialState,
    ProductState,
} from './index';

@Injectable({
    providedIn: 'root',
})
export class ProductStateService extends Feature<ProductState> {
    // SELECT STATE with memoized selectors
    displayCode$: Observable<boolean> = this.select(getShowProductCode);
    selectedProduct$: Observable<Product> = this.select(getCurrentProduct);
    products$: Observable<Product[]> = this.select(getProducts);
    errorMessage$: Observable<string> = this.select(getError);

    constructor(private productService: ProductService) {
        super('products', initialState);
    }

    // FEATURE EFFECTS (scoped to the current feature state)
    // The completed side effects (api calls) update the feature state directly
    loadProducts = this.createEffect(
        mergeMap(() =>
            this.productService.getProducts().pipe(
                map((products) => ({
                    products,
                    error: '',
                })),
                catchError((error) =>
                    of({
                        error,
                        products: [],
                    })
                )
            )
        ),
        'load'
    );

    createProduct = this.createEffect<Product>(
        mergeMap((product) =>
            this.productService.createProduct(product).pipe(
                map((newProduct) => ({
                    products: [...this.state.products, newProduct],
                    currentProductId: newProduct.id,
                    error: '',
                })),
                catchError((error) =>
                    of({
                        error,
                    })
                )
            )
        ),
        'create'
    );

    updateProduct = this.createEffect<Product>(
        mergeMap((product) => {
            return this.productService.updateProduct(product).pipe(
                map((updatedProduct) => {
                    const updatedProducts = this.state.products.map((item) =>
                        updatedProduct.id === item.id ? updatedProduct : item
                    );
                    return {
                        products: updatedProducts,
                        currentProductId: product.id,
                        error: '',
                    };
                }),
                catchError((error) =>
                    of({
                        error,
                    })
                )
            );
        }),
        'update'
    );

    // Delete with Optimistic Update
    deleteProduct = this.createEffect<number>(
        pipe(
            withLatestFrom(this.state$), // Get snapshot of state for undoing optimistic update
            mergeMap(([productId, lastState]) => {
                return this.productService.deleteProduct(productId).pipe(
                    mapTo({
                        products: this.state.products.filter((product) => product.id !== productId),
                        currentProductId: null,
                        error: '',
                    }),
                    catchError((err) =>
                        of({
                            products: lastState.products, // Restore State before Optimistic Update
                            error: err,
                        })
                    ),
                    // Example for an Optimistic Update
                    startWith({
                        products: this.state.products.filter((product) => product.id !== productId),
                    })
                );
            })
        ),
        'delete'
    );

    // UPDATE STATE
    setCurrentProduct(id: number) {
        this.setState({ currentProductId: id }, 'currProd');
    }

    clearCurrentProduct() {
        this.setState({ currentProductId: undefined }, 'clearCurrProd');
    }

    initializeCurrentProduct() {
        this.setState({ currentProductId: 0 }, 'initCurrProd');
    }

    showProductCode(showProductCode: boolean) {
        this.setState({ showProductCode }, 'showProductCode');
    }
}
