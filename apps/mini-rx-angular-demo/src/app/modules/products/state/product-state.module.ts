import { NgModule } from '@angular/core';
import { EffectsModule, StoreModule } from 'mini-rx-store-ng';
import { ProductEffects } from './product.effects';
import { productReducer } from './product.reducer';

@NgModule({
    declarations: [],
    imports: [
        EffectsModule.register([ProductEffects]),
        StoreModule.forFeature('products', productReducer),
    ],
})
export class ProductStateModule {}
