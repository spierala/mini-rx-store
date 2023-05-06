import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { Action, SetStateParam, SetStateReturn, StateOrCallback } from './models';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { Injectable, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { miniRxIsSignal } from './utils';

// BaseStore is extended by ComponentStore/FeatureStore
@Injectable()
export abstract class BaseStore<StateType extends object> {
    /**
     * @internal Used by ComponentStore/FeatureStore
     */
    protected _sub: Subscription = new Subscription();

    update<P extends SetStateParam<StateType>>(
        stateOrCallback: P,
        name?: string
    ): SetStateReturn<StateType, P> {
        const dispatchFn = (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
            return this._dispatchSetStateAction(stateOrCallback, name);
        };

        const result = miniRxIsSignal(stateOrCallback)
            ? (toObservable(stateOrCallback) as Observable<Partial<StateType>>)
            : stateOrCallback;

        return (
            isObservable(result)
                ? this._sub.add(result.subscribe((v) => dispatchFn(v, name)))
                : dispatchFn(result as StateOrCallback<StateType>, name)
        ) as SetStateReturn<StateType, P>;
    }

    /** @internal
     * Implemented by ComponentStore/FeatureStore
     */
    abstract _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name?: string
    ): Action;

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

        this._sub.add(effectWithDefaultErrorHandler.subscribe());

        return ((
            observableOrValue?: ObservableType | Observable<ObservableType> | Signal<ObservableType>
        ) => {
            // If we detect a Signal: convert Signal to Observable
            observableOrValue = miniRxIsSignal(observableOrValue)
                ? toObservable(observableOrValue)
                : observableOrValue;

            isObservable(observableOrValue)
                ? this._sub.add(observableOrValue.subscribe((v) => subject.next(v)))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    destroy() {
        this._sub.unsubscribe();
    }

    /**
     * @internal
     * Can be called by Angular if ComponentStore/FeatureStore is provided in a component
     */
    ngOnDestroy() {
        this.destroy();
    }
}
