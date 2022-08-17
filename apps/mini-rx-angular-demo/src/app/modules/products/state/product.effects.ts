import { Injectable } from '@angular/core';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';

import { Action, Actions, mapResponse, undo, createEffect } from 'mini-rx-store';
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
import { Observable, timer } from 'rxjs';

@Injectable()
export class ProductEffects {
    timer$ = timer(0, 1000);

    constructor(private productService: ProductApiService, private actions$: Actions) {}

    // TODO remove: try non-dispatching effect
    test$ = createEffect(
        this.timer$.pipe(
            tap((v) => console.log(v)),
            map((v) => true)
        ),
        { dispatch: false }
    );

    loadProducts$ = createEffect(
        this.actions$.pipe(
            ofType(load),
            mergeMap((action) =>
                this.productService.getProducts().pipe(
                    mapResponse(
                        (products) => loadSuccess(products),
                        (error) => loadFail(error)
                    )
                )
            )
        ),
        { dispatch: true }
    );

    // Effect with optimistic update
    updateProduct$: Observable<Action> = createEffect(
        this.actions$.pipe(
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
        )
    );

    createProduct$ = createEffect(
        this.actions$.pipe(
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
        )
    );

    deleteProduct$ = createEffect(
        this.actions$.pipe(
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
        )
    );
}
