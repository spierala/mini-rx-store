import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { catchError, map, mergeMap, startWith } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

import { Actions, Action, undo } from 'mini-rx-store';
import { ofType, toPayload } from 'ts-action-operators';
import {
    createProduct,
    createProductFail,
    createProductSuccess,
    deleteProduct,
    deleteProductFail,
    deleteProductSuccess,
    load,
    loadFail,
    loadSuccess,
    updateProduct,
    updateProductFail,
    updateProductOptimistic,
    updateProductSuccess,
} from './product.actions';

@Injectable({ providedIn: 'root' })
export class ProductEffects {
    constructor(private productService: ProductService, private actions$: Actions) {}

    loadProducts$ = this.actions$.pipe(
        ofType(load),
        mergeMap((action) =>
            this.productService.getProducts().pipe(
                map((products) => loadSuccess(products)),
                catchError((err) => of(loadFail(err)))
            )
        )
    );

    updateProduct$ = this.actions$.pipe(
        ofType(updateProduct),
        toPayload(),
        mergeMap((product) => {
            const optimisticUpdateAction: Action = updateProductOptimistic(product);

            return this.productService.updateProduct(product).pipe(
                map((updatedProduct) => updateProductSuccess(updatedProduct)),
                catchError((err) => from([updateProductFail(err), undo(optimisticUpdateAction)])),
                startWith(optimisticUpdateAction)
            );
        })
    );

    createProduct$ = this.actions$.pipe(
        ofType(createProduct),
        toPayload(),
        mergeMap((product: Product) =>
            this.productService.createProduct(product).pipe(
                map((newProduct) => createProductSuccess(newProduct)),
                catchError((err) => of(createProductFail(err)))
            )
        )
    );

    deleteProduct$ = this.actions$.pipe(
        ofType(deleteProduct),
        toPayload(),
        mergeMap((productId: number) =>
            this.productService.deleteProduct(productId).pipe(
                map(() => deleteProductSuccess(productId)),
                catchError((err) => of(deleteProductFail(err)))
            )
        )
    );
}
