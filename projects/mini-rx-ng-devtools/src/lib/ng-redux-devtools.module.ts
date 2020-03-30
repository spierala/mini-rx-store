import { Injector, NgModule } from '@angular/core';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';
import { Store } from 'mini-rx-store';

@NgModule({
    declarations: [],
})
export class NgReduxDevtoolsModule {
    constructor(injector: Injector) {
        Store.addExtension(new NgReduxDevtoolsExtension(injector));
    }
}
