import { Action, OperationType, StateOrCallback } from '@mini-rx/common';
import { DestroyRef, EnvironmentInjector, inject, Signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { miniRxIsSignal } from './utils';
import { toObservable } from '@angular/core/rxjs-interop';

export function createConnectFn<StateType>(
    dispatch: (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ) => Action
) {
    const injector = inject(EnvironmentInjector);
    const subs: Subscription = new Subscription();
    inject(DestroyRef).onDestroy(() => subs.unsubscribe());

    function connect<K extends keyof StateType, ValueType = StateType[K]>(
        dict: Record<K, Observable<ValueType> | Signal<ValueType>>
    ): void {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const observableOrSignal: Observable<ValueType> | Signal<ValueType> = dict[key];
            const obs$ = miniRxIsSignal(observableOrSignal)
                ? toObservable(observableOrSignal, { injector })
                : observableOrSignal;
            subs.add(
                obs$.subscribe((v) => {
                    dispatch(
                        {
                            [key]: v,
                        } as unknown as Partial<StateType>,
                        OperationType.CONNECTION,
                        key as string
                    );
                })
            );
        });
    }

    return connect;
}
