import { BehaviorSubject, isObservable, Observable, Subject, Subscription } from 'rxjs';
import { Action, FeatureStoreConfig, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { generateId, miniRxError, select } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { createConnectAction, createSetStateAction, isSetStateAction } from './actions';

export class FeatureStore<StateType extends object> {
    private stateSource: BehaviorSubject<StateType> = new BehaviorSubject<StateType>(
        {} as StateType
    );
    state$: Observable<StateType> = this.stateSource.asObservable();
    get state(): StateType {
        return this.stateSource.getValue();
    }

    // tslint:disable-next-line:variable-name
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private sub: Subscription;
    private readonly featureId: string;

    constructor(featureKey: string, initialState: StateType, config: FeatureStoreConfig = {}) {
        this.featureId = generateId();

        this._featureKey = StoreCore.addFeature<StateType>(
            featureKey,
            createFeatureReducer(this.featureId, initialState),
            config
        );

        this.sub = StoreCore.select((state) => state[this.featureKey]).subscribe(this.stateSource);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action = createSetStateAction(stateOrCallback, this.featureId, this.featureKey, name);

        StoreCore.dispatch(action);

        return action;
    }

    connect<T>(
        obs$: Observable<T>,
        projectFn: (state: StateType, emittedValue: T) => Partial<StateType>,
        name: string
    ): void {
        this.sub.add(
            obs$.subscribe((v) => {
                const action = createConnectAction(
                    (state) => projectFn(this.state, v),
                    this.featureId,
                    this.featureKey,
                    name
                );
                StoreCore.dispatch(action);
            })
        );
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
    featureId: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (isSetStateAction<StateType>(action) && action.featureId === featureId) {
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
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
