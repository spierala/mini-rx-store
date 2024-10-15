import { createState } from './state';
import { AppState, createRxEffectForStore, createStore } from '@mini-rx/common';

export const storeCore = createStore(createState<AppState>({}));
export const actions$ = storeCore.actions$;
export const rxEffect = createRxEffectForStore(storeCore.dispatch);
