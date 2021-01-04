// Credits go to juliette store: https://github.com/markostanimirovic/juliette/blob/1.2.0/projects/juliette-ng/src/lib/effects.module.ts

import {
    ClassProvider,
    Inject,
    InjectionToken,
    ModuleWithProviders,
    NgModule,
    Type,
} from '@angular/core';
import { Observable } from 'rxjs';
import { actions$, Store } from '../store';
import { Action } from '../interfaces';

export const OBJECTS_WITH_EFFECTS = new InjectionToken('__objectsWithEffects__');

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

function fromClassesWithEffectsToClassProviders(
    injectionToken: InjectionToken<any>,
    classesWithEffects: Type<any>[]
): ClassProvider[] {
    return classesWithEffects.map((classWithEffects) => ({
        provide: injectionToken,
        useClass: classWithEffects,
        multi: true,
    }));
}

function fromObjectsWithEffectsToEffects(objectsWithEffects: any[]): Observable<any>[] {
    return objectsWithEffects.reduce((acc, objectWithEffects) => {
        const effectsFromCurrentObject = Object.getOwnPropertyNames(objectWithEffects)
            .filter(
                (prop) =>
                    objectWithEffects[prop] instanceof Observable &&
                    objectWithEffects[prop] !== actions$
            )
            .map((prop) => objectWithEffects[prop]);
        return [...acc, ...effectsFromCurrentObject];
    }, []);
}
