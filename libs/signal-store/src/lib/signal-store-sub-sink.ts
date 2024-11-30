import { DestroyRef, inject } from '@angular/core';
import { createSubSink } from '@mini-rx/common';
import { Subscription } from 'rxjs';

export function createSignalStoreSubSink() {
    const subSink = createSubSink();
    inject(DestroyRef).onDestroy(subSink.unsubscribe);
    return {
        set sink(sub: Subscription) {
            subSink.sink = sub;
        },
    };
}
