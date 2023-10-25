import { DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { isObservable, Observable, Subject } from 'rxjs';
import { defaultEffectsErrorHandler } from '@mini-rx/common';
import { miniRxIsSignal } from './utils';

export function createRxEffectFn() {
    const destroyRef = inject(DestroyRef);

    function rxEffect<
        // Credits for the typings go to NgRx (Component Store): https://github.com/ngrx/platform/blob/13.1.0/modules/component-store/src/component-store.ts#L279-L291
        ProvidedType = void,
        // The actual origin$ type, which could be unknown, when not specified
        OriginType extends Observable<ProvidedType> | unknown = Observable<ProvidedType>,
        // Unwrapped actual type of the origin$ Observable, after default was applied
        ObservableType = OriginType extends Observable<infer A> ? A : never,
        // Return either an empty callback or a function requiring specific types as inputs
        ReturnType = ProvidedType | ObservableType extends void
            ? () => void
            : (
                  observableOrValue:
                      | ObservableType
                      | Observable<ObservableType>
                      | Signal<ObservableType>
              ) => void
    >(effectFn: (origin$: OriginType) => Observable<unknown>): ReturnType {
        const subject = new Subject<ObservableType>();
        const effect$ = effectFn(subject as OriginType);
        effect$.pipe(defaultEffectsErrorHandler, takeUntilDestroyed(destroyRef)).subscribe();

        return ((
            observableOrValue?: ObservableType | Observable<ObservableType> | Signal<ObservableType>
        ) => {
            // If we detect a Signal: convert Signal to Observable
            observableOrValue = miniRxIsSignal(observableOrValue)
                ? toObservable(observableOrValue)
                : observableOrValue;

            isObservable(observableOrValue)
                ? observableOrValue
                      .pipe(takeUntilDestroyed(destroyRef))
                      .subscribe((v) => subject.next(v))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    return rxEffect;
}
