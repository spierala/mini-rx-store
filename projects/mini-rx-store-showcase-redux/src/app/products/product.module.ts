import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ProductShellComponent } from './containers/product-shell/product-shell.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { EffectsModule, StoreModule } from 'mini-rx-store';
import { productReducer } from './state/product.reducer';
import { ProductEffects } from './state/product.effects';

const productRoutes: Routes = [{ path: '', component: ProductShellComponent }];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(productRoutes),
        StoreModule.forFeature('products', productReducer),
        EffectsModule.register([ProductEffects]),
    ],
    declarations: [ProductShellComponent, ProductListComponent, ProductEditComponent],
})
export class ProductModule {
    constructor() {}
}
