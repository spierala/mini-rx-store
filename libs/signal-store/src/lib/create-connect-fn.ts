import { EnvironmentInjector, inject, isSignal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationType, UpdateStateCallback } from '@mini-rx/common';
import { miniRxToObservable } from './mini-rx-to-observable';
import { createSignalStoreSubSink } from './signal-store-sub-sink';

export function createConnectFn<StateType>(updateStateCallback: UpdateStateCallback<StateType>) {
    const subSink = createSignalStoreSubSink();
    const injector = inject(EnvironmentInjector);

    return <K extends keyof StateType, ValueType = StateType[K]>(
        dict: Record<K, Observable<ValueType> | Signal<ValueType>>
    ) => {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const observableOrSignal: Observable<ValueType> | Signal<ValueType> = dict[key];
            const obs$ = isSignal(observableOrSignal)
                ? miniRxToObservable(observableOrSignal, { injector })
                : observableOrSignal;
            subSink.sink = obs$.subscribe((v) => {
                updateStateCallback(
                    {
                        [key]: v,
                    } as unknown as Partial<StateType>,
                    OperationType.CONNECTION,
                    key as string
                );
            });
        });
    };
}
