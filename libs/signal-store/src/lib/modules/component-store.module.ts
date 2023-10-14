import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentStoreConfig } from '@mini-rx/common';
import { globalCsConfig } from '../component-store';

@NgModule()
export class ComponentStoreModule {
    static forRoot(config: ComponentStoreConfig): ModuleWithProviders<ComponentStoreModule> {
        globalCsConfig.set(config);

        return {
            ngModule: ComponentStoreModule,
        };
    }
}
