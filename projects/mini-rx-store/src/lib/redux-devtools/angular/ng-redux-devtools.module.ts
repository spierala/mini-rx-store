import { Injector, NgModule } from '@angular/core';
import { MiniStore } from '../../mini-store-base';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';

@NgModule({
    declarations: [],
})
export class NgReduxDevtoolsModule {
    constructor(injector: Injector) {
        MiniStore.addExtension(new NgReduxDevtoolsExtension(injector))
    }
}
