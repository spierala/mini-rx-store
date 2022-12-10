import { BehaviorSubject, isObservable, Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { miniRxError, select } from './utils';
import { Action, StateOrCallback } from './models';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';

export abstract class BaseStore<StateType extends object> {
    protected stateSource: BehaviorSubject<StateType | undefined> = new BehaviorSubject<
        StateType | undefined
    >(undefined);
    state$: Observable<StateType> = this.stateSource.asObservable().pipe(
        // Skip the first (undefined) value of the BehaviorSubject
        // Very similar to a ReplaySubject(1), but more lightweight
        filter((v) => !!v)
    ) as Observable<StateType>;
    get state(): StateType {
        const v: StateType | undefined = this.stateSource.getValue();
        this.assertStateIsInitialized();
        return v!;
    }

    protected sub: Subscription = new Subscription();

    private notInitializedErrorMessage =
        `${this.constructor.name} has no initialState yet. ` +
        `Please provide an initialState before updating/getting state.`;

    private initializedErrorMessage = `${this.constructor.name} has initialState already.`;
    protected isStateInitialized = false;

    setInitialState(initialState: StateType): void {
        // Called by ComponentStore/FeatureStore
        if (this.isStateInitialized) {
            miniRxError(this.initializedErrorMessage);
        }
        this.isStateInitialized = true;
        // Update state happens in ComponentStore/FeatureStore
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): void {
        // Called by ComponentStore/FeatureStore
        this.assertStateIsInitialized();
        // Update state happens in ComponentStore/FeatureStore
    }

    abstract undo(action: Action): void; // Implemented by ComponentStore and FeatureStore

    select(): Observable<StateType>;
    select<R>(mapFn: (state: StateType) => R): Observable<R>;
    select(mapFn?: any): Observable<any> {
        if (!mapFn) {
            return this.state$;
        }
        return this.state$.pipe(select(mapFn));
    }

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

        this.sub.add(effectWithDefaultErrorHandler.subscribe());

        return ((observableOrValue?: ObservableType | Observable<ObservableType>) => {
            isObservable(observableOrValue)
                ? this.sub.add(observableOrValue.subscribe((v) => subject.next(v)))
                : subject.next(observableOrValue as ObservableType);
        }) as unknown as ReturnType;
    }

    private assertStateIsInitialized(): void {
        if (!this.isStateInitialized) {
            miniRxError(this.notInitializedErrorMessage);
        }
    }

    destroy() {
        this.sub.unsubscribe();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        this.destroy();
    }
}
