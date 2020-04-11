import { Injectable } from '@angular/core';
import { Feature } from 'mini-rx-store';
import { initialState, ProductState } from './product.reducer';
import { ProductService } from '../product.service';
import { catchError, map, mergeMap, startWith, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Product } from '../product';

@Injectable({
    providedIn: 'root'
})
export class ProductStateService extends Feature<ProductState> {

    constructor(
        private productService: ProductService
    ) {
        super('products', initialState);
    }

    displayCode$: Observable<boolean> = this.select(state => state.showProductCode);

    // Effects
    loadFn = this.createEffect(
        'load',
        payload$ => payload$.pipe(
            mergeMap(() =>
                this.productService.getProducts().pipe(
                    map((products) => this.setStateAction({
                        products,
                        error: ''
                    }, 'success')),
                    catchError(error => of(this.setStateAction({
                        error,
                        products: []
                    }, 'error')))
                )
            )
        )
    );

    createProductFn = this.createEffect<Product>(
        'create',
        payload$ => payload$.pipe(
            mergeMap(product =>
                this.productService.createProduct(product).pipe(
                    map(newProduct => this.setStateAction(state => {
                        return {
                            products: [...state.products, newProduct],
                            currentProductId: newProduct.id,
                            error: ''
                        };
                    }), 'success'),
                    catchError(error => of(this.setStateAction({
                        error
                    }, 'error')))
                )
            )
        )
    );

    updateProductFn = this.createEffect<Product>(
        'update',
        payload$ => payload$.pipe(
            mergeMap((product) => {
                return this.productService.updateProduct(product).pipe(
                    map((updatedProduct) => this.setStateAction((state) => {
                        const updatedProducts = state.products.map(
                            item => updatedProduct.id === item.id ? updatedProduct : item
                        );

                        return {
                            products: updatedProducts,
                            currentProductId: product.id,
                            error: ''
                        };
                    }, 'success')),
                    catchError(error => of(this.setStateAction({
                        error
                    }, 'error')))
                );
            })
        )
    );

    deleteProductFn = this.createEffect<number>(
        'delete',
        payload$ => payload$.pipe(
            withLatestFrom(this.state$),
            mergeMap(([productId, lastState]) => {
                return this.productService.deleteProduct(productId).pipe(
                    map(() => this.setStateAction(state => {
                        return {
                            products: state.products.filter(product => product.id !== productId),
                            currentProductId: null,
                            error: ''
                        };
                    }, 'success')),
                    catchError(err => of(this.setStateAction(
                        {
                            products: lastState.products, // Restore State before Optimistic Update
                            error: err
                        }, 'error'
                    ))),
                    // Optimistic Update
                    startWith(this.setStateAction(state => {
                        return {
                            products: state.products.filter(product => product.id !== productId)
                        };
                    }, 'optimistic'))
                );
            })
        )
    );

    // Set State
    setCurrentProduct(id: number) {
        this.setState(state => {
            if (state.currentProductId === id) {
                return state;
            }
            return {
                currentProductId: id
            };
        }, 'currProd');
    }

    clearCurrentProduct() {
        this.setState({currentProductId: undefined}, 'clearCurrProd');
    }

    initializeCurrentProduct() {
        this.setState({currentProductId: 0}, 'initCurrProd');
    }
}
