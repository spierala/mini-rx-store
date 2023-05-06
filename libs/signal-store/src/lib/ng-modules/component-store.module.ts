import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentStoreConfig } from '../models';
import { configureComponentStores } from '../component-store';

@NgModule()
export class ComponentStoreModule {
    static forRoot(config: ComponentStoreConfig): ModuleWithProviders<ComponentStoreModule> {
        configureComponentStores(config);

        return {
            ngModule: ComponentStoreModule,
        };
    }
}
