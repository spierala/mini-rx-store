import { inject, NgZone } from '@angular/core';
import { ReduxDevtoolsExtension } from 'mini-rx-store';
import { AppState, ReduxDevtoolsOptions } from '@mini-rx/common';

export class NgReduxDevtoolsExtension extends ReduxDevtoolsExtension {
    private ngZone = inject(NgZone);

    constructor(options: Partial<ReduxDevtoolsOptions>) {
        super(options);
    }

    override updateState(state: AppState) {
        this.ngZone.run(() => {
            super.updateState(state);
        });
    }
}
