import { Injector, NgModule } from '@angular/core';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';
import { MiniStore } from 'mini-rx-store';

@NgModule({
    declarations: [],
})
export class NgReduxDevtoolsModule {
    constructor(injector: Injector) {
        MiniStore.addExtension(new NgReduxDevtoolsExtension(injector));
    }
}
