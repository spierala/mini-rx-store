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

    private stateSource: BehaviorSubject<StateType> = new BehaviorSubject<StateType>({} as StateType);
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

        StoreCore.addFeature<StateType>(featureKey, createFeatureReducer(featureKey, initialState, this.setStateAction));

        // Select Feature State and delegate to local BehaviorSubject
        this.sub = StoreCore.select(createFeatureSelector<AppState, StateType>(featureKey))
            .subscribe(this.stateSource);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action: ActionWithPayload = {
            type: this.setStateAction.type + (name ?  '/' + name : ''),
            payload: stateOrCallback
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

    effect<PayLoadType = void>(
        effectFn: (payload$: Observable<PayLoadType>) => Observable<any>
    ): (payload?: PayLoadType) => void {
        const subject: Subject<PayLoadType> = new Subject();
        const effectWithDefaultErrorHandler = defaultEffectsErrorHandler(subject.pipe(effectFn));

        this.sub.add(effectWithDefaultErrorHandler.subscribe());

        return (payload?: PayLoadType) => {
            subject.next(payload as PayLoadType);
        };
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
    setStateAction: Action,
): Reducer<StateType> {
    return (state: StateType = initialState, action: ActionWithPayload): StateType => {
        if (action.type.indexOf(setStateAction.type) === 0) {
            const stateOrCallback = action.payload;
            const newPartialState =                 typeof stateOrCallback === 'function'
                    ? stateOrCallback(state)
                    : stateOrCallback;
            return {
                ...state,
                ...newPartialState,
            };
        }
        return state;
    };
}