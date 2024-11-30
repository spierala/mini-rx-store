import { signal } from '@angular/core';
import { AppState, createRegisterEffectFn, createStore } from '@mini-rx/common';
import { createSelectableWritableSignal } from './create-selectable-signal';

export const storeCore = createStore(createSelectableWritableSignal<AppState>(signal({})));
export const rxEffect = createRegisterEffectFn(storeCore.dispatch);
