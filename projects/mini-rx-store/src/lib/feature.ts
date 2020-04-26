import { BehaviorSubject, Observable } from 'rxjs';
import { Action, AppState, Reducer } from './interfaces';
import { default as Store } from './store-core';
import { ofType } from './utils';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { createFeatureSelector } from './selector';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

const nameUpdateAction = 'set-state';

export class FeatureBase<StateType> {
    protected actionTypePrefix: string;

    constructor(
        featureName: string,
        initialState: StateType,
        reducer?: Reducer<StateType>
    ) {
        // Check if feature already exists
        if (!Store.features.has(featureName)) {
            Store.features.set(featureName, this);
        } else {
            throw new Error(`MiniRx: Feature "${featureName}" already exists.`);
        }

        this.actionTypePrefix = '@mini-rx/' + featureName;

        reducer = reducer
            ? reducer
            : createDefaultReducer(this.actionTypePrefix);

        const reducerWithInitialState: Reducer<StateType> = createReducerWithInitialState(
            reducer,
            initialState
        );

        const featureReducer: Reducer<AppState> = createFeatureReducer(
            featureName,
            reducerWithInitialState
        );

        // Add reducer to Store
        Store.addFeatureReducer(featureReducer);
        // Dispatch an initial action to let reducers create the initial state
        Store.dispatch({ type: `${this.actionTypePrefix}/init` });
    }
}

export abstract class Feature<StateType> extends FeatureBase<StateType> {
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/set-state
    private effectCounter = 1; // Used for naming anonymous effects

    protected state$: BehaviorSubject<StateType> = new BehaviorSubject(
        undefined
    );
    private get state(): StateType {
        return this.state$.getValue();
    }

    protected constructor(
        featureName: string,
        initialState: StateType
    ) {
        super(featureName, initialState);

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        // Feature State and delegate to local BehaviorSubject
        Store.select(createFeatureSelector(featureName)).subscribe(this.state$);
    }

    protected setState(
        stateOrCallback: StateOrCallback<StateType>,
        name?: string
    ): void {
        Store.dispatch({
            type: name
                ? this.actionTypeSetState + '/' + name
                : this.actionTypeSetState,
            payload: this.calcNewState(this.state, stateOrCallback),
        });
    }

    protected select<K>(mapFn: (state: StateType | AppState) => K, selectFromStore: boolean = false): Observable<K> {
        if (selectFromStore) {
            return Store.select(mapFn);
        }

        return this.state$.pipe(
            map((state: StateType) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    private getEffectStartActionType(effectName): string {
        if (!effectName) {
            effectName = this.effectCounter;
            this.effectCounter++;
        }
        return `${this.actionTypePrefix}/effect/${effectName}`;
    }

    protected createEffect<PayLoadType = any>(
        effectFn: (
            payload: Observable<PayLoadType>
        ) => Observable<StateOrCallback<StateType>>,
        effectName?: string
    ): (payload?: PayLoadType) => void {
        const effectStartActionType = this.getEffectStartActionType(effectName);
        const effect$: Observable<Action> = Store.actions$.pipe(
            ofType(effectStartActionType),
            map((action) => action.payload),
            effectFn,
            map((stateOrCallback) => {
                return {
                    type: effectStartActionType + '/' + nameUpdateAction,
                    payload: this.calcNewState(this.state, stateOrCallback),
                };
            })
        );

        Store.createEffect(effect$);

        return (payload?: PayLoadType) => {
            Store.dispatch({
                type: effectStartActionType,
                payload,
            });
        };
    }

    private calcNewState(
        state: StateType,
        stateOrCallback: StateOrCallback<StateType>
    ): StateType {
        if (typeof stateOrCallback === 'function') {
            return {
                ...state,
                ...stateOrCallback(state),
            };
        }
        return {
            ...state,
            ...stateOrCallback,
        };
    }
}

function createDefaultReducer<StateType>(
    nameSpaceFeature: string
): Reducer<StateType> {
    return (state: StateType, action: Action) => {
        // Check for 'set-state' (can originate from setState() or feature effect)
        if (
            action.type.indexOf(nameSpaceFeature) > -1 &&
            action.type.indexOf(nameUpdateAction) > -1
        ) {
            return {
                ...state,
                ...action.payload,
            };
        }
        return state;
    };
}

function createReducerWithInitialState<StateType>(
    reducer: Reducer<StateType>,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        state = state === undefined ? initialState : state;
        return reducer(state, action);
    };
}

function createFeatureReducer(
    featureName: string,
    reducer: Reducer<any>
): Reducer<AppState> {
    return (state: AppState, action: Action): AppState => {
        return {
            ...state,
            [featureName]: reducer(state[featureName], action),
        };
    };
}
