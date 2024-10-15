import { signal } from '@angular/core';
import { AppState, createRxEffectForStore, createStore } from '@mini-rx/common';
import { createSelectableWritableSignal } from './selectable-signal-state';

export const storeCore = createStore(createSelectableWritableSignal<AppState>(signal({})));
export const rxEffect = createRxEffectForStore(storeCore.dispatch);
