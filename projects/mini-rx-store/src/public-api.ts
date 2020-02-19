/*
 * Public API Surface of mini-rx-store
 */

export { Action, MiniFeature, Settings } from './lib/interfaces';
export { MiniStore, actions$ } from './lib/mini-store-base';
export * from './lib/mini-store.utils';
export { ReduxDevtoolsExtension } from './lib/redux-devtools/redux-devtools.extension';
export { NgReduxDevtoolsModule } from './lib/redux-devtools/angular/ng-redux-devtools.module';

