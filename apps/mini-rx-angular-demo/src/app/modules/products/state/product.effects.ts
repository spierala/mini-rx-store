import { Injectable } from '@angular/core';
import { mergeMap, startWith } from 'rxjs/operators';

import { Action, Actions, mapResponse, undo } from 'mini-rx-store';
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
import { Product } from '../models/product';
import { ProductApiService } from '../services/product-api.service';

@Injectable({ providedIn: 'root' })
export class ProductEffects {
    constructor(private productService: ProductApiService, private actions$: Actions) {}

    loadProducts$ = this.actions$.pipe(
        ofType(load),
        mergeMap((action) =>
            this.productService.getProducts().pipe(
                mapResponse(
                    (products) => loadSuccess(products),
                    (error) => loadFail(error)
                )
            )
        )
    );

    // Effect with optimistic update
    updateProduct$ = this.actions$.pipe(
        ofType(updateProduct),
        toPayload(),
        mergeMap((product) => {
            const optimisticUpdateAction: Action = updateProductOptimistic(product);

            return this.productService.updateProduct(product).pipe(
                mapResponse(
                    (updatedProduct) => updateProductSuccess(updatedProduct),
                    (err) => [updateProductFail(err), undo(optimisticUpdateAction)]
                ),
                startWith(optimisticUpdateAction)
            );
        })
    );

    createProduct$ = this.actions$.pipe(
        ofType(createProduct),
        toPayload(),
        mergeMap((product: Product) =>
            this.productService.createProduct(product).pipe(
                mapResponse(
                    (newProduct) => createProductSuccess(newProduct),
                    (err) => createProductFail(err)
                )
            )
        )
    );

    deleteProduct$ = this.actions$.pipe(
        ofType(deleteProduct),
        toPayload(),
        mergeMap((productId: number) =>
            this.productService.deleteProduct(productId).pipe(
                mapResponse(
                    () => deleteProductSuccess(productId),
                    (err) => deleteProductFail(err)
                )
            )
        )
    );
}
