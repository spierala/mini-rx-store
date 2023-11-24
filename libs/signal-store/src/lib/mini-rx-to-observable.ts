// Credits go to Angular
// Copied from with small modifications: https://github.com/angular/angular/blob/16.2.10/packages/core/rxjs-interop/src/to_observable.ts

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
    assertInInjectionContext,
    DestroyRef,
    effect,
    inject,
    Injector,
    Signal,
    untracked,
} from '@angular/core';
import { ToObservableOptions } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';

// Reimplemented `toObservable` from Angular
// Use Subject instead of ReplaySubject (which is more lightweight and sufficient for internal use in MiniRx)
export function miniRxToObservable<T>(
    source: Signal<T>,
    options?: ToObservableOptions
): Observable<T> {
    !options?.injector && assertInInjectionContext(miniRxToObservable);
    const injector = options?.injector ?? inject(Injector);
    const subject = new Subject<T>();

    const watcher = effect(
        () => {
            let value: T;
            try {
                value = source();
            } catch (err) {
                untracked(() => subject.error(err));
                return;
            }
            untracked(() => subject.next(value));
        },
        { injector, manualCleanup: true }
    );

    injector.get(DestroyRef).onDestroy(() => {
        watcher.destroy();
        subject.complete();
    });

    return subject.asObservable();
}
