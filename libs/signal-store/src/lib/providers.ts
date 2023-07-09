import {
    Action,
    Actions,
    AppState,
    ComponentStoreConfig,
    FeatureConfig,
    Reducer,
    StoreConfig,
} from './models';
import {
    ClassProvider,
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    inject,
    InjectionToken,
    makeEnvironmentProviders,
    Type,
} from '@angular/core';
import { actions$, addFeature, rxEffect } from './store-core';

import { Store } from './store';
import { Observable } from 'rxjs';
import { hasEffectMetaData } from './utils';
import { configureComponentStores } from './component-store';

const STORE_PROVIDER = new InjectionToken<void>('@mini-rx/store-provider');
const STORE_CONFIG = new InjectionToken<StoreConfig<any>>('@mini-rx/store-config');

const FEATURE_PROVIDER = new InjectionToken<void>('@mini-rx/feature-provider');
const FEATURE_NAMES = new InjectionToken<string[]>('@mini-rx/feature-names');
const FEATURE_REDUCERS = new InjectionToken<Reducer<any>[]>('@mini-rx/feature-reducers');
const FEATURE_CONFIGS = new InjectionToken<FeatureConfig<any>[]>('@mini-rx/feature-configs');

const OBJECTS_WITH_EFFECTS = new InjectionToken<object[]>('@mini-rx/objectsWithEffects');
const EFFECTS_PROVIDER = new InjectionToken<void>('@mini-rx/effects-provider');

const COMPONENT_STORE_CONFIG_PROVIDER = new InjectionToken<void>(
    '@mini-rx/component-store-config-provider'
);

// Store
export function storeFactory(config: StoreConfig<AppState>) {
    return new Store(config);
}

function rootStoreProviderFactory(): void {
    inject(Store);
    inject(Actions);
}

export function provideStore<T>(config: StoreConfig<T>): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: STORE_CONFIG, useValue: config },
        {
            provide: Store,
            useFactory: storeFactory,
            deps: [STORE_CONFIG],
        },
        {
            provide: Actions,
            useValue: actions$,
        },
        { provide: STORE_PROVIDER, useFactory: rootStoreProviderFactory },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useFactory() {
                return () => inject(STORE_PROVIDER);
            },
        },
    ]);
}

// Feature
function featureProviderFactory(): void {
    const featureNames = inject(FEATURE_NAMES);
    const reducers = inject(FEATURE_REDUCERS);
    const configs = inject(FEATURE_CONFIGS);

    featureNames.forEach((featureName, index) => {
        addFeature(featureName, reducers[index], configs[index]);
    });
}

export function provideFeature<T>(
    featureName: string,
    reducer: Reducer<T>,
    config?: Partial<FeatureConfig<T>>
): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: FEATURE_NAMES, multi: true, useValue: featureName },
        { provide: FEATURE_REDUCERS, multi: true, useValue: reducer },
        { provide: FEATURE_CONFIGS, multi: true, useValue: config },
        { provide: FEATURE_PROVIDER, useFactory: featureProviderFactory },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useFactory() {
                return () => inject(FEATURE_PROVIDER);
            },
        },
    ]);
}

// Effects
function effectsProviderFactory(): void {
    const objectsWithEffects = inject(OBJECTS_WITH_EFFECTS);

    const effects = fromObjectsWithEffectsToEffects(objectsWithEffects);
    effects.forEach((effect: Observable<Action>) => {
        rxEffect(effect);
    });
}

export function provideEffects(classesWithEffects: Type<any>[]): EnvironmentProviders;
export function provideEffects(...classesWithEffects: Type<any>[]): EnvironmentProviders;
export function provideEffects(...classesWithEffects: any[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        ...fromClassesWithEffectsToClassProviders(OBJECTS_WITH_EFFECTS, classesWithEffects),
        { provide: EFFECTS_PROVIDER, useFactory: effectsProviderFactory },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useFactory() {
                return () => inject(EFFECTS_PROVIDER);
            },
        },
    ]);
}

// Todo: move to @mini-rx/common lib
const fromClassesWithEffectsToClassProviders = (
    injectionToken: InjectionToken<any>,
    classesWithEffects: Type<any>[]
): ClassProvider[] =>
    classesWithEffects.map((classWithEffects) => ({
        provide: injectionToken,
        useClass: classWithEffects,
        multi: true,
    }));

// Todo: move to @mini-rx/common lib
const fromObjectsWithEffectsToEffects = (objectsWithEffects: any[]): Observable<any>[] =>
    objectsWithEffects.reduce((acc, objectWithEffects) => {
        const effectsFromCurrentObject = Object.getOwnPropertyNames(objectWithEffects).reduce<
            Array<Observable<any>>
        >((acc, prop) => {
            const effect = objectWithEffects[prop];
            if (hasEffectMetaData(effect)) {
                acc.push(effect);
            }
            return acc;
        }, []);
        return [...acc, ...effectsFromCurrentObject];
    }, []);

// Component Store config
export function provideComponentStoreConfig(config: ComponentStoreConfig) {
    return makeEnvironmentProviders([
        {
            provide: COMPONENT_STORE_CONFIG_PROVIDER,
            useFactory: () => configureComponentStores(config),
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useFactory() {
                return () => inject(COMPONENT_STORE_CONFIG_PROVIDER);
            },
        },
    ]);
}
