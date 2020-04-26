import { Inject, Injectable, InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';
import { ReduxDevtoolsOptions, Store } from 'mini-rx-store';

const OPTIONS = new InjectionToken<ReduxDevtoolsOptions>('ReduxDevtoolsOptions');

@Injectable({
    providedIn: 'root'
})
export class NgReduxDevtoolsService {
    constructor(private injector: Injector, @Inject(OPTIONS) private options: ReduxDevtoolsOptions) {
        Store.addExtension(new NgReduxDevtoolsExtension(options, injector));
    }
}

@NgModule()
export class NgReduxDevtoolsModule {
    static instrument(
        config: Partial<ReduxDevtoolsOptions> = {}
    ): ModuleWithProviders<NgReduxDevtoolsModule> {
        return {
            ngModule: NgReduxDevtoolsModule,
            providers: [
                {
                    provide: OPTIONS,
                    useValue: config
                }
            ]
        };
    }

    constructor(ngReduxDevTools: NgReduxDevtoolsService) {

    }
}
