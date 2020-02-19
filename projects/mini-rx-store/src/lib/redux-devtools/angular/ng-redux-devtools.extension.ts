import { ReduxDevtoolsExtension } from '../redux-devtools.extension';
import { Injector, NgZone, Type } from '@angular/core';

export class NgReduxDevtoolsExtension extends ReduxDevtoolsExtension {
    private ngZone: NgZone = this.injector.get<NgZone>(NgZone as Type<NgZone>);

    constructor(
        private injector: Injector
    ) {
        super()
    }

    updateState(state) {
        this.ngZone.run(() => {
            super.stateSource.next(state);
        });
    }
}
