// Credits go to juliette store: https://github.com/markostanimirovic/juliette/blob/1.2.0/projects/juliette-ng/src/lib/effects.module.ts

import { Inject, InjectionToken, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Action, Store } from 'mini-rx-store';
import {
    fromClassesWithEffectsToClassProviders,
    fromObjectsWithEffectsToEffects,
} from './effects-mapper';

const OBJECTS_WITH_EFFECTS = new InjectionToken('__objectsWithEffects__');

@NgModule()
export class EffectsModule {
    constructor(private store: Store, @Inject(OBJECTS_WITH_EFFECTS) objectsWithEffects: any[]) {
        const effects = fromObjectsWithEffectsToEffects(
            objectsWithEffects.splice(0, objectsWithEffects.length)
        );
        effects.forEach((effect: Observable<Action>) => {
            this.store.createEffect(effect);
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
