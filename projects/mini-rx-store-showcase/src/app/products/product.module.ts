import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ProductShellComponent } from './containers/product-shell/product-shell.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductStoreService } from './state/product-store.service';

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
    private productStore: ProductStoreService // Initializes feature state, do not remove!
  ) {

  }
}
