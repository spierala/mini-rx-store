import { Injectable } from '@angular/core';
import { ProductState, reducer } from './product.reducer';
import { Load, ProductActions } from './product.actions';
import { FeatureStore } from 'mini-rx-store';
import { ProductEffects } from './product.effects';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends FeatureStore<ProductState, ProductActions> {
  constructor(
    productEffects: ProductEffects
  ) {
    super('products', reducer, productEffects.effects$);

    this.dispatch(new Load());
  }
}
