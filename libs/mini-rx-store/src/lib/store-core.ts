import { createState } from './create-state';
import { AppState, createRegisterEffectFn, createStore } from '@mini-rx/common';

export const storeCore = createStore(createState<AppState>({}));
export const actions$ = storeCore.actions$;
export const rxEffect = createRegisterEffectFn(storeCore.dispatch);
