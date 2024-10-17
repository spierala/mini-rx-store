import { signal } from '@angular/core';
import { AppState, createRxEffectForStore, createStore } from '@mini-rx/common';
import { createSelectableWritableSignal } from './create-selectable-signal';

export const storeCore = createStore(createSelectableWritableSignal<AppState>(signal({})));
export const rxEffect = createRxEffectForStore(storeCore.dispatch);
