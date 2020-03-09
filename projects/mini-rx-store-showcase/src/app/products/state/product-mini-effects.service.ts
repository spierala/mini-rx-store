import { Injectable } from '@angular/core';
import { MiniFeature, MiniStore } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './product.reducer';
import { ProductService } from '../product.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductMiniEffectsService extends MiniFeature<ProductState>{

    constructor(
        private productService: ProductService
    ) {
        super('products', initialState, reducer);
    }

    loadFn = this.createMiniEffect(
        'load',
        payload$ => payload$.pipe(
            mergeMap(() => {
                return this.productService.getProducts().pipe(
                    map((products) => new this.SetStateAction(state => {
                        return {
                            ...state,
                            products,
                            error: ''
                        };
                    })),
                    catchError(err => of(new this.SetStateAction(state => {
                        return {
                            ...state,
                            products: [],
                            error: err
                        };
                    })))
                );
            })
        )
    );

    deleteProductFn = this.createMiniEffect<number>(
        'delete',
        payload$ => payload$.pipe(
            mergeMap((productId) => {
                return this.productService.deleteProduct(productId).pipe(
                    map(() => new this.SetStateAction(state => {
                        return {
                            ...state,
                            products: state.products.filter(product => product.id !== productId),
                            currentProductId: null,
                            error: ''
                        };
                    })),
                    catchError(err => of(new this.SetStateAction(state => {
                        return {
                            ...state,
                            error: err
                        };
                    })))
                );
            })
        )
    );
}
