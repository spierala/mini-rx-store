import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsShellComponent } from './components/products-shell/products-shell.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';

@NgModule({
    declarations: [
        ProductsShellComponent,
        ProductDetailComponent,
        ProductListComponent,
        ProductFilterComponent,
    ],
    imports: [CommonModule, ProductsRoutingModule, FormsModule, ReactiveFormsModule],
})
export class ProductsModule {}
