import { Observable, Subject } from 'rxjs';
import { Action, AppState } from './interfaces';
import { MiniStoreCore as Store, Reducer } from './mini-store-core';
import { combineReducers, createFeatureSelector, ofType } from './mini-store.utils';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';

type SetStateFn<StateType> = (state: StateType) => StateType;

export class MiniFeature<StateType> {

    state$: Observable<StateType>;
    private setStateFn$: Subject<(state: StateType) => StateType> = new Subject();
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

        this.setStateFn$.pipe(
            withLatestFrom(this.state$),
            map(([setStateFn, state]) => {
                return setStateFn(state);
            }),
            tap((newState) => Store.dispatch(new this.SetStateAction(newState)))
        ).subscribe();
    }

    setState(stateFn: (state: StateType) => StateType): void {
        this.setStateFn$.next(stateFn);
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
                if (action instanceof this.SetStateAction && typeof action.payload === 'function') {
                    return new this.SetStateAction(action.payload(state))
                }
                return action;
            })
        );

        Store.addEffects([newEffect]);

        return (payload?: PayLoadType) => {
            Store.dispatch(new EffectStartAction(payload));
        };
    }

    setStateAction(payload: StateType | SetStateFn<StateType>): Action {
        return new this.SetStateAction(payload);
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
