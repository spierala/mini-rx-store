import { DestroyRef, inject } from '@angular/core';
import { createSubSink } from '@mini-rx/common';

export function createSignalStoreSubSink() {
    const { unsubscribe, sink } = createSubSink();
    inject(DestroyRef).onDestroy(unsubscribe);
    return {
        sink,
    };
}
