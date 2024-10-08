import { createSubSink, OperationType, UpdateStateCallback } from '@mini-rx/common';
import { Observable } from 'rxjs';

export function createConnectFn<StateType>(
    updateStateCallback: UpdateStateCallback<StateType>,
    subSink: ReturnType<typeof createSubSink>
) {
    return <K extends keyof StateType, ValueType = StateType[K]>(
        dict: Record<K, Observable<ValueType>>
    ) => {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const obs$ = dict[key];
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
