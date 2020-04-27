import { Injector, NgZone, Type } from '@angular/core';
import { ReduxDevtoolsExtension } from 'mini-rx-store';
import { ReduxDevtoolsOptions } from 'mini-rx-store';

export class NgReduxDevtoolsExtension extends ReduxDevtoolsExtension {
    private ngZone: NgZone = this.injector.get<NgZone>(NgZone as Type<NgZone>);

    constructor(
        options: Partial<ReduxDevtoolsOptions>,
        private injector: Injector
    ) {
        super(options);
    }

    updateState(state) {
        this.ngZone.run(() => {
            super.updateState(state);
        });
    }
}
