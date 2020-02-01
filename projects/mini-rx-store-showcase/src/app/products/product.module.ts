import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ProductShellComponent } from './containers/product-shell/product-shell.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { MiniStore } from 'mini-rx-store';
import { initialState, reducer } from './state/product.reducer';
import { Load } from './state/product.actions';
import { ProductEffects } from './state/product.effects';

const productRoutes: Routes = [
  { path: '', component: ProductShellComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(productRoutes),
  ],
  declarations: [
    ProductShellComponent,
    ProductListComponent,
    ProductEditComponent
  ]
})
export class ProductModule {
  constructor(
    private productEffects: ProductEffects
  ) {
      MiniStore.addFeature('products', initialState, reducer);
      MiniStore.addEffects(this.productEffects.effects$);

      MiniStore.dispatch(new Load());
  }
}
