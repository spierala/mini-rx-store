// Credits go to juliette store: https://github.com/markostanimirovic/juliette/blob/1.2.0/projects/juliette-ng/src/lib/effects.module.ts

import {
    Inject,
    InjectionToken,
    ModuleWithProviders,
    NgModule,
    Optional,
    Type,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Action, Store } from 'mini-rx-store';
import {
    fromClassesWithEffectsToClassProviders,
    fromObjectsWithEffectsToEffects,
} from './effects-mapper';
import { StoreFeatureModule, StoreRootModule } from './store.module';

const OBJECTS_WITH_EFFECTS = new InjectionToken('@mini-rx/objectsWithEffects');

@NgModule()
export class EffectsModule {
    constructor(
        private store: Store,
        @Inject(OBJECTS_WITH_EFFECTS) objectsWithEffects: any[],
        // Make sure effects can select state from store, also if EffectsModule is registered before Store.forFeature
        @Optional() storeRootModule: StoreRootModule,
        @Optional() storeFeatureModule: StoreFeatureModule
    ) {
        const effects = fromObjectsWithEffectsToEffects(
            objectsWithEffects.splice(0, objectsWithEffects.length)
        );
        effects.forEach((effect: Observable<Action>) => {
            this.store.effect(effect);
        });
    }

    static register(classesWithEffects: Type<any>[]): ModuleWithProviders<EffectsModule> {
        return {
            ngModule: EffectsModule,
            providers: [
                ...fromClassesWithEffectsToClassProviders(OBJECTS_WITH_EFFECTS, classesWithEffects),
            ],
        };
    }
}
