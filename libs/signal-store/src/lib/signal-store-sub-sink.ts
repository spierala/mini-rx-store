import { DestroyRef, inject } from '@angular/core';
import { createSubSink } from '@mini-rx/common';
import { Subscription } from 'rxjs';

export function createSignalStoreSubSink() {
    const { unsubscribe, sink } = createSubSink();
    inject(DestroyRef).onDestroy(unsubscribe);
    return {
        set sink(sub: Subscription) {
            sink(sub);
        },
    };
}
