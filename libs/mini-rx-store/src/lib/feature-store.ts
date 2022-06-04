import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { Action, Reducer, StateOrCallback } from './models';
import StoreCore from './store-core';
import { miniRxError } from './utils';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';
import { MiniRxActionType, SetStateAction } from './actions';
import { SimpleStore } from './simple-store';

export class FeatureStore<StateType extends object> extends SimpleStore<StateType> {
    // tslint:disable-next-line:variable-name
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private sub = new Subscription();
    private readonly internalFeatureId: number;

    constructor(
        featureKey: string,
        initialState: StateType,
        private config: { multi?: boolean } = {}
    ) {
        super(initialState);

        this.internalFeatureId = getInternalFeatureId();

        this._featureKey = StoreCore.addFeature<StateType>(
            featureKey,
            createFeatureReducer(this.internalFeatureId, initialState),
            config
        );

        this.sub.add(
            StoreCore.select((state) => state[this.featureKey]).subscribe(this['stateSource'])
        );
    }

    override setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action = new SetStateAction(
            stateOrCallback,
            this.internalFeatureId,
            this.featureKey,
            name
        );

        StoreCore.dispatch(action);

        return action;
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

export function calcNewState<T>(state: T, stateOrCallback: StateOrCallback<T>): T {
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
