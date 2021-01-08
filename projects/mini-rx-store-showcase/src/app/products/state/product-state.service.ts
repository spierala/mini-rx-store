import { Injectable } from '@angular/core';
import { FeatureStore } from 'mini-rx-store';
import { ProductService } from '../product.service';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, pipe } from 'rxjs';
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
export class ProductStateService extends FeatureStore<ProductState> {
    // SELECT STATE with memoized selectors
    displayCode$: Observable<boolean> = this.select(getShowProductCode);
    selectedProduct$: Observable<Product> = this.select(getCurrentProduct);
    products$: Observable<Product[]> = this.select(getProducts);
    errorMessage$: Observable<string> = this.select(getError);

    constructor(private productService: ProductService) {
        super('products', initialState);
    }

    // FEATURE EFFECTS (scoped to the current feature state)
    loadProducts = this.createEffect<void>(
        mergeMap(() =>
            this.productService.getProducts().pipe(
                tap((products) => this.setState((state) => ({ products }), 'load success')),
                catchError((error) => {
                    this.setState(
                        {
                            error,
                            products: [],
                        },
                        'load error'
                    );
                    return EMPTY;
                })
            )
        )
    );

    createProduct = this.createEffect<Product>((payload$) => {
        return payload$.pipe(
            mergeMap((product) => {
                return this.productService.createProduct(product).pipe(
                    tap((newProduct) =>
                        this.setState(
                            {
                                products: [...this.state.products, newProduct],
                                currentProductId: newProduct.id,
                                error: '',
                            },
                            'create success'
                        )
                    ),
                    catchError((error) => {
                        this.setState({ error }, 'create error');
                        return EMPTY;
                    })
                );
            })
        );
    });

    updateProduct = this.createEffect<Product>(
        mergeMap((product) => {
            return this.productService.updateProduct(product).pipe(
                tap((updatedProduct) => {
                    const updatedProducts = this.state.products.map((item) =>
                        updatedProduct.id === item.id ? updatedProduct : item
                    );
                    this.setState(
                        {
                            products: updatedProducts,
                            currentProductId: product.id,
                            error: '',
                        },
                        'update success'
                    );
                }),
                catchError((error) => {
                    this.setState({ error }, 'update error');
                    return EMPTY;
                })
            );
        })
    );

    // Delete with Optimistic Update
    deleteProduct = this.createEffect<number>(
        pipe(
            mergeMap((productId) => {
                // Optimistic Update
                const optimisticUpdate = this.setState(
                    {
                        products: this.state.products.filter((product) => product.id !== productId),
                    },
                    'delete optimistic'
                );

                return this.productService.deleteProduct(productId).pipe(
                    tap(() =>
                        this.setState(
                            {
                                products: this.state.products.filter(
                                    (product) => product.id !== productId
                                ),
                                currentProductId: null,
                                error: '',
                            },
                            'delete success'
                        )
                    ),
                    catchError((error) => {
                        // Undo Optimistic Update
                        this.undo(optimisticUpdate);
                        this.showError(error);
                        return EMPTY;
                    })
                );
            })
        )
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

    showError(error) {
        this.setState({ error }, 'show error');
    }
}
