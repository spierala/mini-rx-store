import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentStoreConfig, configureComponentStores } from 'mini-rx-store';

@NgModule()
export class ComponentStoreModule {
    static forRoot(config: ComponentStoreConfig): ModuleWithProviders<ComponentStoreModule> {
        configureComponentStores(config);

        return {
            ngModule: ComponentStoreModule,
        };
    }
}
