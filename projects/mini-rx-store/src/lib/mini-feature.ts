import { Observable, Subject } from 'rxjs';
import { Action, AppState } from './interfaces';
import { MiniStoreCore as Store, Reducer } from './mini-store-core';
import { combineReducers, createFeatureSelector, ofType } from './mini-store.utils';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;

export class MiniFeature<StateType> {

    state$: Observable<StateType>;
    private stateOrCallback$: Subject<Partial<StateType> | SetStateFn<StateType>> = new Subject();
    private SetStateAction: new(payload: Partial<StateType> | SetStateFn<StateType>) => Action;

    constructor(
        private featureName: string,
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

        // Feature State
        this.state$ = Store.select(createFeatureSelector(featureName));

        // Create Default Action and Reducer for Update Feature State (needed for setState())
        const updateActionType = `@mini-rx/feature/${featureName}/set-state`;
        this.SetStateAction = class {
            type = updateActionType;
            constructor(public payload: StateType | SetStateFn<StateType>) {}
        };
        const defaultReducer: Reducer<StateType> = createDefaultReducer(updateActionType);

        // Combine feature and default reducer
        const reducers: Reducer<StateType>[] = reducer ? [defaultReducer, reducer] : [defaultReducer];
        const combinedReducer: Reducer<StateType> = combineReducers(reducers);
        // Add initial state to combined reducer
        const combinedReducerWithInitialState: Reducer<StateType> = createReducerWithInitialState(combinedReducer, initialState);
        // The reducer must know its feature to reduce feature state only...
        const featureReducer: Reducer<AppState> = createFeatureReducer(featureName, combinedReducerWithInitialState);

        // Add reducer to MiniStore
        Store.addFeatureReducer(featureReducer);
        // Dispatch an initial action to let reducers create the initial state
        Store.dispatch({type: `@mini-rx/feature/${featureName}/init`});

        this.stateOrCallback$.pipe(
            withLatestFrom(this.state$),
            tap(([stateOrCallback, state]) => {
                let newState: Partial<StateType>;

                if (typeof stateOrCallback === 'function') {
                    newState = {
                        ...state,
                        ...stateOrCallback(state)
                    };
                } else {
                    newState = {
                        ...state,
                        ...stateOrCallback
                    };
                }

                Store.dispatch(new this.SetStateAction(newState));
            })
        ).subscribe();
    }

    select(mapFn: ((state: StateType) => any)): Observable<any> {
        return this.state$.pipe(
            map((state: StateType) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    createEffect<PayLoadType = any>(
        effectName: string,
        effectFn: (payload: Observable<PayLoadType>) => Observable<Action>
    ): (payload?: PayLoadType) => void {
        const effectStartActionType = `@mini-rx/feature/${this.featureName}/effect/${effectName}`;
        const EffectStartAction = class {
            type = effectStartActionType;
            constructor(public payload: PayLoadType) {}
        };

        const newEffect: Observable<Action> = Store.actions$.pipe(
            ofType(effectStartActionType),
            map((action) => action.payload),
            effectFn,
            withLatestFrom(this.state$),
            map(([action, state]) => {
                const stateOrCallback: Partial<StateType> | SetStateFn<StateType> = action.payload;
                let newState: Partial<StateType>;

                if (action instanceof this.SetStateAction && typeof stateOrCallback === 'function') {
                    newState = {
                        ...state,
                        ...stateOrCallback(state)
                    };
                } else {
                    newState = {
                        ...state,
                        ...stateOrCallback
                    };
                }
                return new this.SetStateAction(newState);
            })
        );

        Store.addEffects([newEffect]);

        return (payload?: PayLoadType) => {
            Store.dispatch(new EffectStartAction(payload));
        };
    }

    setState(stateOrCallback: Partial<StateType> | SetStateFn<StateType>): void {
        throwErrorIfWrongType(stateOrCallback);
        this.stateOrCallback$.next(stateOrCallback);
    }

    setStateAction(stateOrCallback: Partial<StateType> | SetStateFn<StateType>): Action {
        throwErrorIfWrongType(stateOrCallback);
        return new this.SetStateAction(stateOrCallback);
    }
}

function createDefaultReducer<StateType>(type: string): Reducer<StateType> {
    return (state: StateType, action: Action) => {
        if (action.type === type) {
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

function throwErrorIfWrongType(state: any) {
    if (typeof state !== 'function' && typeof state !== 'object') {
        throw new Error('MiniRx: Pass an object or a function for the state parameter when calling setState().');
    }
}
