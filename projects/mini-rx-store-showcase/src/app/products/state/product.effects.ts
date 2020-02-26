import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

import * as productActions from './product.actions';
import { Action, actions$, ofType } from 'mini-rx-store';

@Injectable({
  providedIn: 'root'
})
export class ProductEffects {

  constructor(private productService: ProductService) { }

  private loadProducts$: Observable<Action> = actions$.pipe(
    ofType(productActions.ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
      )
    )
  );

  private updateProduct$: Observable<Action> = actions$.pipe(
    ofType(productActions.ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  private createProduct$: Observable<Action> = actions$.pipe(
    ofType(productActions.ProductActionTypes.CreateProduct),
    map((action: productActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.CreateProductFail(err)))
      )
    )
  );

  effects$: Observable<Action>[] = [this.loadProducts$, this.updateProduct$, this.createProduct$];
}
