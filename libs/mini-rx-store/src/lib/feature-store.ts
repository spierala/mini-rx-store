import { BehaviorSubject, isObservable, Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, FeatureStoreConfig, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { miniRxError, select } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { createSetStateAction, isSetStateAction } from './actions';

export class FeatureStore<StateType extends object> {
    private stateSource: BehaviorSubject<StateType | undefined> = new BehaviorSubject<
        StateType | undefined
    >(undefined);
    state$: Observable<StateType> = this.stateSource.asObservable().pipe(
        // Skip the first (undefined) value of the BehaviorSubject
        // Very similar to a ReplaySubject(1), but more lightweight
        filter((v) => !!v)
    ) as Observable<StateType>;
    get state(): StateType {
        const v: StateType | undefined = this.stateSource.getValue();
        if (!v) {
            miniRxError(this.notInitializedErrorMessage);
        }
        return v!;
    }

    // tslint:disable-next-line:variable-name
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private sub: Subscription = new Subscription();
    private readonly featureId: string;

    private notInitializedErrorMessage =
        `${this.constructor.name} has no initialState yet. ` +
        `Please provide an initialState before updating/getting state.`;

    private initializedErrorMessage = `${this.constructor.name} has initialState already.`;

    constructor(
        featureKey: string,
        private initialState: StateType | undefined,
        config: FeatureStoreConfig = {}
    ) {
        this.featureId = generateId();
        this._featureKey = config.multi ? featureKey + '-' + generateId() : featureKey;

        this.initFeature();
    }

    private initFeature(): void {
        if (this.initialState) {
            StoreCore.addFeature<StateType>(
                this._featureKey,
                createFeatureReducer(this.featureId, this.initialState)
            );

            this.sub.add(
                StoreCore.select((state) => state[this.featureKey]).subscribe(this.stateSource)
            );
        }
    }

    setInitialState(initialState: StateType): void {
        if (this.initialState) {
            miniRxError(this.initializedErrorMessage);
        }
        this.initialState = initialState;
        this.initFeature();
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        if (!this.initialState) {
            miniRxError(this.notInitializedErrorMessage);
        }

        const action = createSetStateAction(stateOrCallback, this.featureId, this.featureKey, name);

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

// Simple alpha numeric ID: https://stackoverflow.com/a/12502559/453959
// This isn't a real GUID!
function generateId() {
    return Math.random().toString(36).slice(2);
}

export function createFeatureStore<T extends object>(
    featureKey: string,
    initialState: T,
    config: FeatureStoreConfig = {}
): FeatureStore<T> {
    return new FeatureStore<T>(featureKey, initialState, config);
}
