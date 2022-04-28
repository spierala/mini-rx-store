import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Action, ActionWithPayload, AppState, Reducer } from './models';
import StoreCore from './store-core';
import { createMiniRxAction, miniRxError, select } from './utils';
import { createFeatureSelector } from './selector';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

export class FeatureStore<StateType extends object> {
    private readonly setStateAction: Action; // E.g. {type: '@mini-rx/set-state/products'}

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

    constructor(featureKey: string, initialState: StateType) {
        this._featureKey = featureKey;

        this.setStateAction = createMiniRxAction('set-state', featureKey);

        StoreCore.addFeature<StateType>(
            featureKey,
            createFeatureReducer(featureKey, initialState, this.setStateAction)
        );

        // Select Feature State and delegate to local BehaviorSubject
        this.sub = StoreCore.select(
            createFeatureSelector<AppState, StateType>(featureKey)
        ).subscribe(this.stateSource);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action: ActionWithPayload = {
            type: this.setStateAction.type + (name ? '/' + name : ''),
            payload: stateOrCallback,
        };

        StoreCore.dispatch(action);

        return action;
    }

    select(): Observable<StateType>;
    select<K>(mapFn: (state: StateType) => K): Observable<K>;
    select<K, T extends (state: StateType) => K>(mapFn?: T): Observable<K | StateType> {
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
            : (payload: ObservableType) => void
    >(effectFn: (origin$: OriginType) => Observable<unknown>): ReturnType {
        const subject = new Subject<ObservableType>();
        const effect$ = effectFn(subject as OriginType);
        const effectWithDefaultErrorHandler = defaultEffectsErrorHandler(effect$);

        this.sub.add(effectWithDefaultErrorHandler.subscribe());

        return ((payload?: ObservableType) => {
            subject.next(payload as ObservableType);
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
    featureKey: string,
    initialState: StateType,
    setStateAction: Action
): Reducer<StateType> {
    return (state: StateType = initialState, action: ActionWithPayload): StateType => {
        if (action.type.indexOf(setStateAction.type) === 0) {
            const stateOrCallback = action.payload;
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
