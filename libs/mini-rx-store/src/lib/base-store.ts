import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { miniRxError } from './utils';
import { Action, SetStateParam, SetStateReturn, StateOrCallback } from './models';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { State } from './state';

// BaseStore is extended by ComponentStore/FeatureStore
export abstract class BaseStore<StateType extends object> {
    /**
     * @internal Used by ComponentStore/FeatureStore
     */
    protected _sub: Subscription = new Subscription();
    /**
     * @internal Used by ComponentStore/FeatureStore
     */
    protected _state = new State<StateType>();
    /** @deprecated Use the `select` method without arguments */
    state$: Observable<StateType> = this._state.select();
    get state(): StateType {
        this.assertStateIsInitialized();
        return this._state.get()!;
    }
    private isStateInitialized = false;
    private notInitializedErrorMessage =
        `${this.constructor.name} has no initialState yet. ` +
        `Please provide an initialState before updating/getting state.`;
    private initializedErrorMessage = `${this.constructor.name} has initialState already.`;

    // Called by ComponentStore/FeatureStore
    setInitialState(initialState: StateType): void {
        this.assertStateIsNotInitialized();
        this.isStateInitialized = true;
        // Update state happens in ComponentStore/FeatureStore
    }

    setState<P extends SetStateParam<StateType>>(
        stateOrCallback: P,
        name?: string
    ): SetStateReturn<StateType, P> {
        const dispatchFn = (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
            this.assertStateIsInitialized();
            return this._dispatchSetStateAction(stateOrCallback, name);
        };

        return (
            isObservable(stateOrCallback)
                ? this._sub.add(stateOrCallback.subscribe((v) => dispatchFn(v, name)))
                : dispatchFn(stateOrCallback as StateOrCallback<StateType>, name)
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

    effect<
        // Credits for the typings go to NgRx (Component Store): https://github.com/ngrx/platform/blob/13.1.0/modules/component-store/src/component-store.ts#L279-L291
        ProvidedType = void,
        // The actual origin$ type, which could be unknown, when not specified
        OriginType extends Observable<ProvidedType> | unknown = Observable<ProvidedType>,
        // Unwrapped actual type of the origin$ Observable, after default was applied
        ObservableType = OriginType extends Observable<infer A> ? A : never,
        // Return either an empty callback or a function requiring specific types as inputs
        ReturnType = ProvidedType | ObservableType extends void
            ? () => void
            : (observableOrValue: ObservableType | Observable<ObservableType>) => void
    >(effectFn: (origin$: OriginType) => Observable<unknown>): ReturnType {
        const subject = new Subject<ObservableType>();
        const effect$ = effectFn(subject as OriginType);
        const effectWithDefaultErrorHandler = defaultEffectsErrorHandler(effect$);

        this._sub.add(effectWithDefaultErrorHandler.subscribe());

        return ((observableOrValue?: ObservableType | Observable<ObservableType>) => {
            isObservable(observableOrValue)
                ? this._sub.add(observableOrValue.subscribe((v) => subject.next(v)))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    private assertStateIsInitialized(): void {
        if (!this.isStateInitialized) {
            miniRxError(this.notInitializedErrorMessage);
        }
    }

    private assertStateIsNotInitialized(): void {
        if (this.isStateInitialized) {
            miniRxError(this.initializedErrorMessage);
        }
    }

    select = this._state.select.bind(this._state);

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
