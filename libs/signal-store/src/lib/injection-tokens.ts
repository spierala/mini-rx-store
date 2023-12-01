import { InjectionToken } from '@angular/core';
import { FeatureConfig, miniRxNameSpace, Reducer, StoreConfig } from '@mini-rx/common';

// Injection tokens are part of the bundle, therefore keep the strings as short as possible (they just have to be unique!)

export const STORE_CONFIG = new InjectionToken<StoreConfig<any>>(`${miniRxNameSpace}/1`);
export const FEATURE_NAMES = new InjectionToken<string[]>(`${miniRxNameSpace}/2`);
export const FEATURE_REDUCERS = new InjectionToken<Reducer<any>[]>(`${miniRxNameSpace}/3`);
export const FEATURE_CONFIGS = new InjectionToken<FeatureConfig<any>[]>(`${miniRxNameSpace}/4`);

export const OBJECTS_WITH_EFFECTS = new InjectionToken<object[]>(`${miniRxNameSpace}/5`);

export const STORE_PROVIDER = new InjectionToken<void>(`${miniRxNameSpace}/6`);
export const FEATURE_PROVIDER = new InjectionToken<void>(`${miniRxNameSpace}/7`);
export const EFFECTS_PROVIDER = new InjectionToken<void>(`${miniRxNameSpace}/8`);
export const COMPONENT_STORE_CONFIG_PROVIDER = new InjectionToken<void>(`${miniRxNameSpace}/9`);
