import { Observable, Subject } from 'rxjs';
import { Action, AppState, Reducer } from './interfaces';
import { default as Store } from './store-core';
import { ofType } from './utils';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';
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
            // Create Feature Store instance
            Store.features.set(featureName, this);
        } else {
            throw new Error(`MiniRx: Feature "${featureName}" already exists.`);
        }

        this.actionTypePrefix =  '@mini-rx/' + featureName;

        reducer = reducer ? reducer : createDefaultReducer(this.actionTypePrefix);
        const reducerWithInitialState: Reducer<StateType> = createReducerWithInitialState(reducer, initialState);
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, reducerWithInitialState);

        // Add reducer to Store
        Store.addFeatureReducer(featureReducer);
        // Dispatch an initial action to let reducers create the initial state
        Store.dispatch({type: `${this.actionTypePrefix}/init`});
    }
}

export class Feature<StateType> extends FeatureBase<StateType> {

    state$: Observable<StateType>;
    private stateOrCallbackWithName$: Subject<{
        stateOrCallback: StateOrCallback<StateType>,
        name: string
    }> = new Subject();

    private readonly actionTypeSetState: string;

    constructor(
        private featureName: string,
        initialState: StateType
    ) {
        super(featureName, initialState);

        // Feature State
        this.state$ = Store.select(createFeatureSelector(featureName));

        // Create Default Action Type and Reducer (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        this.stateOrCallbackWithName$.pipe(
            withLatestFrom(this.state$),
            tap(([stateOrCallbackWithName, state]) => {
                const {stateOrCallback, name} = stateOrCallbackWithName;

                Store.dispatch({
                    type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
                    payload: this.calcNewState(state, stateOrCallback)
                });
            })
        ).subscribe();
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): void {
        this.stateOrCallbackWithName$.next({
            stateOrCallback,
            name
        });
    }

    setStateAction(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        return {
            type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
            payload: stateOrCallback
        };
    }

    select<K>(mapFn: (state: StateType) => K): Observable<K> {
        return this.state$.pipe(
            map((state: StateType) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    createEffect<PayLoadType = any>(
        effectName: string,
        effectFn: (payload: Observable<PayLoadType>) => Observable<Action>
    ): (payload?: PayLoadType) => void {
        const effectStartActionType = `${this.actionTypePrefix}/effect/${effectName}`;
        const effect$: Observable<Action> = Store.actions$.pipe(
            ofType(effectStartActionType),
            map(action => action.payload),
            effectFn,
            withLatestFrom(this.state$),
            map(([action, state]) => {
                // Handle SetStateActions
                if (action.type.indexOf(this.actionTypeSetState) > -1) {
                    return {
                        // type: Append set-state name: e.g. '@mini-rx/products/effect/load/set-state/success'
                        type: effectStartActionType + '/' + nameUpdateAction + action.type.split(nameUpdateAction)[1],
                        payload: this.calcNewState(state, action.payload)
                    };
                }
                // Every other Action
                return action;
            })
        );

        Store.createEffect(effect$);

        return (payload?: PayLoadType) => {
            Store.dispatch({
                type: effectStartActionType,
                payload
            });
        };
    }

    private calcNewState(state: StateType, stateOrCallback: StateOrCallback<StateType>): StateType {
        if (typeof stateOrCallback === 'function') {
            return {
                ...state,
                ...stateOrCallback(state)
            };
        }
        return {
            ...state,
            ...stateOrCallback
        };
    }
}

function createDefaultReducer<StateType>(nameSpaceFeature: string): Reducer<StateType> {
    return (state: StateType, action: Action) => {

        // Check for 'set-state' (setState() or feature effect setStateAction())
        if (action.type.indexOf(nameSpaceFeature) > -1 && action.type.indexOf(nameUpdateAction) > -1) {
            return {
                ...state,
                ...action.payload
            };
        }
        return state;
    };
}

function createReducerWithInitialState<StateType>(reducer: Reducer<StateType>, initialState: StateType): Reducer<StateType> {
    return (state: StateType, action: Action): StateType => {
        state = state === undefined ? initialState : state;
        return reducer(state, action);
    };
}

function createFeatureReducer(featureName: string, reducer: Reducer<any>): Reducer<AppState> {
    return (state: AppState, action: Action): AppState => {
        return {
            ...state,
            [featureName]: reducer(state[featureName], action)
        };
    };
}
