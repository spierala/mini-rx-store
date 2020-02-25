import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ProductShellComponent } from './containers/product-shell/product-shell.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { MiniFeature, MiniStore } from 'mini-rx-store';
import { initialState, ProductState, reducer } from './state/product.reducer';
import { Load } from './state/product.actions';
import { ProductEffects } from './state/product.effects';
import { ProductService } from './product.service';
import { of, pipe } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { SetStateAction } from '../../../../mini-rx-store/src/lib/mini-store-base';

const productRoutes: Routes = [
    {path: '', component: ProductShellComponent}
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
        private productEffects: ProductEffects,
        private productService: ProductService
    ) {
        const feature: MiniFeature<ProductState> = MiniStore.feature<ProductState>('products', initialState, reducer);
        const deleteFn = feature.createMiniEffect<number>(
            'delete',
            pipe(
                tap((productId) => {
                    // Optimistic Update
                    feature.setState(state => {
                        return {
                            ...state,
                            showProductCode: false,
                            currentProductId: productId
                        }
                    })
                }),
                mergeMap((productId) => {
                    return this.productService.deleteProduct(productId).pipe(
                        map(() => new SetStateAction<ProductState>(state => {
                            return {
                                ...state,
                                products: state.products.filter(product => product.id !== productId),
                                currentProductId: null,
                                error: ''
                            }
                        })),
                        catchError(err => of(new SetStateAction<ProductState>(state => {
                            return {
                                ...state,
                                error: err
                            };
                        })))
                    )
                })
            )
        );

        MiniStore.effects(this.productEffects.effects$);

        MiniStore.dispatch(new Load());

        setTimeout(() => deleteFn(1), 5000);
    }
}
