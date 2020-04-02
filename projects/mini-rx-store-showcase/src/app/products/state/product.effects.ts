import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

import * as productActions from './product.actions';
import { actions$, ofType, Store } from 'mini-rx-store';

@Injectable({
  providedIn: 'root'
})
export class ProductEffects {

  constructor(private productService: ProductService) {
      Store.createEffect(
          actions$.pipe(
              ofType(productActions.ProductActionTypes.UpdateProduct),
              map((action: productActions.UpdateProduct) => action.payload),
              mergeMap((product: Product) =>
                  this.productService.updateProduct(product).pipe(
                      map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
                      catchError(err => of(new productActions.UpdateProductFail(err)))
                  )
              )
          )
      );

      Store.createEffect(
          actions$.pipe(
              ofType(productActions.ProductActionTypes.CreateProduct),
              map((action: productActions.CreateProduct) => action.payload),
              mergeMap((product: Product) =>
                  this.productService.createProduct(product).pipe(
                      map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
                      catchError(err => of(new productActions.CreateProductFail(err)))
                  )
              )
          )
      );
  }
}
