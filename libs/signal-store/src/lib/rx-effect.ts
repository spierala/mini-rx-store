import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { DestroyRef, inject, Signal } from '@angular/core';
import { defaultEffectsErrorHandler } from '@mini-rx/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { miniRxIsSignal } from './utils';

export function createRxEffectFn() {
    const subs: Subscription = new Subscription();
    inject(DestroyRef).onDestroy(() => subs.unsubscribe());

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
        subs.add(effect$.pipe(defaultEffectsErrorHandler).subscribe());

        return ((
            observableOrValue?: ObservableType | Observable<ObservableType> | Signal<ObservableType>
        ) => {
            // If we detect a Signal: convert Signal to Observable
            observableOrValue = miniRxIsSignal(observableOrValue)
                ? toObservable(observableOrValue)
                : observableOrValue;

            isObservable(observableOrValue)
                ? subs.add(observableOrValue.subscribe((v) => subject.next(v)))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    return rxEffect;
}
