import { NgModule } from '@angular/core';
import { EffectsModule, StoreModule } from 'mini-rx-store-ng';
import { ProductsEffects } from './products.effects';
import { productsReducer } from './products.reducer';

@NgModule({
    declarations: [],
    imports: [
        EffectsModule.register([ProductsEffects]),
        StoreModule.forFeature('products', productsReducer),
    ],
})
export class ProductsStateModule {}
