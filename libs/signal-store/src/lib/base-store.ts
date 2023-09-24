import { isObservable, Observable, Subject } from 'rxjs';
import { Action, StateOrCallback } from './models';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { DestroyRef, EnvironmentInjector, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { miniRxIsSignal } from './utils';
import { OperationType, MiniRxAction } from './actions';

// BaseStore is extended by ComponentStore/FeatureStore
@Injectable()
export abstract class BaseStore<StateType extends object> {
    private _injector = inject(EnvironmentInjector);

    /** @internal
     * Used here and by ComponentStore/FeatureStore
     */
    protected _destroyRef = inject(DestroyRef);

    update(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        return this._dispatchMiniRxAction(stateOrCallback, OperationType.SET_STATE, name);
    }

    /** @internal
     * Implemented by ComponentStore/FeatureStore
     */
    abstract _dispatchMiniRxAction(
        stateOrCallback: StateOrCallback<StateType>,
        actionType: OperationType,
        name?: string
    ): MiniRxAction<StateType>;

    // Implemented by ComponentStore/FeatureStore
    abstract undo(action: Action): void;

    rxEffect<
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
        const effectWithDefaultErrorHandler = defaultEffectsErrorHandler(effect$);

        effectWithDefaultErrorHandler.pipe(takeUntilDestroyed(this._destroyRef)).subscribe();

        return ((
            observableOrValue?: ObservableType | Observable<ObservableType> | Signal<ObservableType>
        ) => {
            // If we detect a Signal: convert Signal to Observable
            observableOrValue = miniRxIsSignal(observableOrValue)
                ? toObservable(observableOrValue)
                : observableOrValue;

            isObservable(observableOrValue)
                ? observableOrValue
                      .pipe(takeUntilDestroyed(this._destroyRef))
                      .subscribe((v) => subject.next(v))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    connect<K extends keyof StateType, ReactiveType = StateType[K]>(
        dict: Record<K, Observable<ReactiveType> | Signal<ReactiveType>>
    ): void {
        const keys: K[] = Object.keys(dict) as K[];

        keys.forEach((key) => {
            const observableOrSignal: Observable<ReactiveType> | Signal<ReactiveType> = dict[key];
            const obs$ = miniRxIsSignal(observableOrSignal)
                ? toObservable(observableOrSignal, { injector: this._injector })
                : observableOrSignal;
            obs$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
                this._dispatchMiniRxAction(
                    {
                        [key]: v,
                    } as unknown as Partial<StateType>,
                    OperationType.CONNECTION,
                    key as string
                );
            });
        });
    }
}
