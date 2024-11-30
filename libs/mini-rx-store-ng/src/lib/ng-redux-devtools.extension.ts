import { Injector, NgZone, Type } from '@angular/core';
import { ReduxDevtoolsExtension } from 'mini-rx-store';
import { AppState, ReduxDevtoolsOptions } from '@mini-rx/common';

export class NgReduxDevtoolsExtension extends ReduxDevtoolsExtension {
    private ngZone: NgZone = this.injector.get<NgZone>(NgZone as Type<NgZone>);

    constructor(options: Partial<ReduxDevtoolsOptions>, private injector: Injector) {
        super(options);
    }

    override updateState(state: AppState) {
        this.ngZone.run(() => {
            super.updateState(state);
        });
    }
}
