import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { Action, FeatureStoreInstanceConfig, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { generateId, isSetStateAction, miniRxError, select } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { SetStateAction } from './actions';

export class FeatureStore<StateType extends object> {
    state$: Observable<StateType> = StoreCore.select((state) => state[this.featureKey]);
    get state(): StateType {
        let value: StateType;
        this.state$
            .subscribe((state) => {
                value = state;
            })
            .unsubscribe();
        return value!;
    }

    // tslint:disable-next-line:variable-name
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private sub = new Subscription();
    private readonly internalFeatureId: string;

    constructor(
        featureKey: string,
        initialState: StateType,
        config: FeatureStoreInstanceConfig = {}
    ) {
        this.internalFeatureId = generateId();

        this._featureKey = StoreCore.addFeature<StateType>(
            featureKey,
            createFeatureReducer(this.internalFeatureId, initialState),
            config
        );
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action = new SetStateAction(
            stateOrCallback,
            this.internalFeatureId,
            this.featureKey,
            name
        );

        StoreCore.dispatch(action);

        return action;
    }

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

    undo(action: Action) {
        isUndoExtensionInitialized
            ? StoreCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    destroy() {
        this.sub.unsubscribe();
        StoreCore.removeFeature(this._featureKey);
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        this.destroy();
    }
}

function createFeatureReducer<StateType>(
    internalFeatureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (
            isSetStateAction<StateType>(action) &&
            action.__internalFeatureId === internalFeatureId
        ) {
            const stateOrCallback = action.stateOrCallback;
            const newPartialState =
                typeof stateOrCallback === 'function' ? stateOrCallback(state) : stateOrCallback;
            return {
                ...state,
                ...newPartialState,
            };
        }
        return state;
    };
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T,
    config: FeatureStoreInstanceConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
