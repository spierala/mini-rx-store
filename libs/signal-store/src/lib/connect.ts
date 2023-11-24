import { EnvironmentInjector, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Action, OperationType, StateOrCallback } from '@mini-rx/common';
import { miniRxIsSignal } from './utils';
import { miniRxToObservable } from './mini-rx-to-observable';
import { createSignalStoreSubSink } from './signal-store-sub-sink';

export function createConnectFn<StateType>(
    dispatch: (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ) => Action
) {
    const subSink = createSignalStoreSubSink();
    const injector = inject(EnvironmentInjector);

    function connect<K extends keyof StateType, ValueType = StateType[K]>(
        dict: Record<K, Observable<ValueType> | Signal<ValueType>>
    ): void {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const observableOrSignal: Observable<ValueType> | Signal<ValueType> = dict[key];
            const obs$ = miniRxIsSignal(observableOrSignal)
                ? miniRxToObservable(observableOrSignal, { injector })
                : observableOrSignal;
            subSink.sink = obs$.subscribe((v) => {
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
