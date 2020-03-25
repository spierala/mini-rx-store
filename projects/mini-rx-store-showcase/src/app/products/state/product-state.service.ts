import { Injectable } from '@angular/core';
import { MiniFeature } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './product.reducer';
import { ProductService } from '../product.service';
import { catchError, map, mergeMap, startWith, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductStateService extends MiniFeature<ProductState>{

    constructor(
        private productService: ProductService
    ) {
        super('products', initialState, reducer);
    }

    loadFn = this.createEffect(
        'load',
        payload$ => payload$.pipe(
            mergeMap(() => {
                return this.productService.getProducts().pipe(
                    map((products) => this.setStateAction({
                        products,
                        error: ''
                    }, 'success')),
                    catchError(error => of(this.setStateAction({
                        error,
                        products: []
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
}
