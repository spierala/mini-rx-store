import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

import { Action, actions$, Store } from 'mini-rx-store';
import { ofType, toPayload } from "ts-action-operators";
import {
    createProduct, createProductFail, createProductSuccess, deleteProduct, deleteProductFail, deleteProductSuccess,
    load,
    loadFail,
    loadSuccess,
    updateProduct,
    updateProductFail,
    updateProductSuccess
} from './product.actions';

@Injectable({providedIn: 'root'})
export class ProductEffects {

  constructor(private productService: ProductService) {
      Store.createEffect(this.loadProducts$);
      Store.createEffect(this.updateProduct$);
      Store.createEffect(this.createProduct$);
      Store.createEffect(this.deleteProduct$);
  }

  loadProducts$: Observable<Action> = actions$.pipe(
    ofType(load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (loadSuccess(products))),
        catchError(err => of(loadFail(err)))
      )
    )
  );

  updateProduct$: Observable<Action> = actions$.pipe(
    ofType(updateProduct),
    map((action: Action) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (updateProductSuccess(updatedProduct))),
        catchError(err => of(updateProductFail(err)))
      )
    )
  );

  createProduct$: Observable<Action> = actions$.pipe(
    ofType(createProduct),
    map((action: Action) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (createProductSuccess(newProduct))),
        catchError(err => of(createProductFail(err)))
      )
    )
  );

  deleteProduct$: Observable<Action> = actions$.pipe(
    ofType(deleteProduct),
    map((action: Action) => action.payload),
    mergeMap((productId: number) =>
      this.productService.deleteProduct(productId).pipe(
        map(() => (deleteProductSuccess(productId))),
        catchError(err => of(deleteProductFail(err)))
      )
    )
  );
}
