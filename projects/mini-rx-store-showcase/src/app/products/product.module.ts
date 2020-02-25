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
import { of } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { UpdateFeatureStateAction } from '../../../../mini-rx-store/src/lib/mini-store-base';

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

        // const testDeleteProduct$: Observable<Action> = actions$.pipe(
        //     ofType(productActions.ProductActionTypes.DeleteProduct),
        //     map((action: productActions.DeleteProduct) => action.payload),
        //     mergeMap((productId: number) =>
        //         this.productService.deleteProduct(productId).pipe(
        //             map(() => new UpdateFeatureStateAction<ProductState>(state => {
        //                 return {
        //                     ...state,
        //                     products: state.products.filter(product => product.id !== productId),
        //                     currentProductId: null,
        //                     error: ''
        //                 }
        //             })),
        //             catchError(err => of(new UpdateFeatureStateAction<ProductState>(state => {
        //                 return {
        //                     ...state,
        //                     error: err
        //                 };
        //             })))
        //         )
        //     )
        // );

        const deleteEffect = feature.createMiniEffect(
            'delete',
            mergeMap((productId: number) => {

                debugger

                return this.productService.deleteProduct(productId).pipe(
                    map(() => new UpdateFeatureStateAction<ProductState>(state => {
                        return {
                            ...state,
                            products: state.products.filter(product => product.id !== productId),
                            currentProductId: null,
                            error: ''
                        }
                    })),
                    catchError(err => of(new UpdateFeatureStateAction<ProductState>(state => {
                        return {
                            ...state,
                            error: err
                        };
                    })))
                )
            })
        );

        MiniStore.effects(this.productEffects.effects$);

        MiniStore.dispatch(new Load());

        setTimeout(() => deleteEffect(1), 5000);
    }
}
