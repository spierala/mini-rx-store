// Credits: Akita: https://github.com/datorama/akita/blob/master/libs/akita-ng-devtools/src/lib/ng-devtools.module.ts)

import {
    APP_INITIALIZER,
    Inject,
    Injectable,
    InjectionToken,
    Injector,
    ModuleWithProviders,
    NgModule,
} from '@angular/core';
import { NgReduxDevtoolsExtension } from './ng-redux-devtools.extension';
import { ReduxDevtoolsOptions, Store } from 'mini-rx-store';

export const DEVTOOLS_OPTIONS = new InjectionToken<ReduxDevtoolsOptions>(
    '@mini-rx/reduxDevtoolsOptions'
);

@Injectable({
    providedIn: 'root',
})
export class NgReduxDevtoolsService {
    constructor(
        private injector: Injector,
        private store: Store,
        @Inject(DEVTOOLS_OPTIONS) private options: ReduxDevtoolsOptions
    ) {
        this.store._addExtension(new NgReduxDevtoolsExtension(options, injector));
    }
}

// Auto initialize the devtools
export function d() {}
export function init(devtoolsService: NgReduxDevtoolsService) {
    return d;
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
                    provide: DEVTOOLS_OPTIONS,
                    useValue: config,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: init,
                    deps: [NgReduxDevtoolsService],
                    multi: true,
                },
            ],
        };
    }
}
