import { BehaviorSubject, isObservable, Observable, Subject, Subscription } from 'rxjs';
import { Action, InstantiationMode, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { miniRxError, select } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { MiniRxAction, MiniRxActionType, SetStateAction } from './actions';

type SetStateFn<StateType> = (stateOrCallback: StateOrCallback<StateType>, name?: string) => Action;

function createSetStateFn<StateType>(stateSource: BehaviorSubject<StateType>) {
    return (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
        stateSource.next(calcNewState(stateSource.getValue(), stateOrCallback));
        return new MiniRxAction('noop');
    };
}

function createSetStateFnWithDispatch<StateType>(
    internalFeatureId: number,
    featureKey: string
): SetStateFn<StateType> {
    return (stateOrCallback: StateOrCallback<StateType>, name?: string): Action => {
        const action = new SetStateAction(stateOrCallback, internalFeatureId, featureKey, name);
        StoreCore.dispatch(action);
        return action;
    };
}

export class FeatureStore<StateType extends object> {
    private stateSource: BehaviorSubject<StateType> = new BehaviorSubject<StateType>(
        this.initialState
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

    private sub = new Subscription();
    private readonly internalFeatureId: number;

    setState: SetStateFn<StateType>;

    get mode(): InstantiationMode {
        return this.config.instantiation;
    }

    constructor(
        featureKey: string,
        private initialState: StateType,
        private config: {
            instantiation: InstantiationMode;
        } = { instantiation: InstantiationMode.SINGLE }
    ) {
        this.internalFeatureId = getInternalFeatureId();

        if (this.mode !== InstantiationMode.MULTIPLE_DETACHED) {
            this._featureKey = StoreCore.addFeature<StateType>(
                featureKey,
                createFeatureReducer(this.internalFeatureId, initialState),
                {
                    multi: config.instantiation === InstantiationMode.MULTIPLE,
                }
            );

            this.setState = createSetStateFnWithDispatch(this.internalFeatureId, this.featureKey);

            this.sub.add(
                StoreCore.select((state) => state[this.featureKey]).subscribe(this.stateSource)
            );
        } else {
            this._featureKey = featureKey;
            this.setState = createSetStateFn(this.stateSource);
        }
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
        if (this.mode === InstantiationMode.MULTIPLE_DETACHED) {
            miniRxError('Undo is not supported when using `InstantiationMode.MULTIPLE_DETACHED`.');
        }

        isUndoExtensionInitialized
            ? StoreCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    destroy() {
        this.sub.unsubscribe();
        if (this.mode !== InstantiationMode.MULTIPLE_DETACHED) {
            StoreCore.removeFeature(this._featureKey);
        }
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        this.destroy();
    }
}

let internalFeatureId = 1;
export function getInternalFeatureId() {
    return internalFeatureId++;
}

function createFeatureReducer<StateType>(
    internalFeatureId: number,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        if (
            isSetStateAction<StateType>(action) &&
            action.__internalFeatureId === internalFeatureId
        ) {
            return calcNewState(state, action.stateOrCallback);
        }
        return state;
    };
}

function calcNewState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
    const newPartialState =
        typeof stateOrCallback === 'function' ? stateOrCallback(state) : stateOrCallback;
    return {
        ...state,
        ...newPartialState,
    };
}

const key: keyof SetStateAction<any> = '__internalType';
const type: MiniRxActionType = 'set-state';
// Type predicate
function isSetStateAction<T>(action: Action): action is SetStateAction<T> {
    return action[key] === type;
}
