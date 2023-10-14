import { Action, OperationType, StateOrCallback } from '@mini-rx/common';
import { DestroyRef, EnvironmentInjector, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { miniRxIsSignal } from './utils';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export function createConnectFn<StateType>(
    dispatch: (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ) => Action
) {
    const injector = inject(EnvironmentInjector);
    const destroyRef = inject(DestroyRef);

    function connect<K extends keyof StateType, ReactiveType = StateType[K]>(
        dict: Record<K, Observable<ReactiveType> | Signal<ReactiveType>>
    ): void {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const observableOrSignal: Observable<ReactiveType> | Signal<ReactiveType> = dict[key];
            const obs$ = miniRxIsSignal(observableOrSignal)
                ? toObservable(observableOrSignal, { injector })
                : observableOrSignal;
            obs$.pipe(takeUntilDestroyed(destroyRef)).subscribe((v) => {
                dispatch(
                    {
                        [key]: v,
                    } as unknown as Partial<StateType>,
                    OperationType.CONNECTION,
                    key as string
                );
            });
        });
    }

    return connect;
}
