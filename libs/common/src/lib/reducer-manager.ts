import { AppState, MetaReducer, Reducer, ReducerDictionary, Action, ReducerState } from './models';
import { combineMetaReducers } from './combine-meta-reducers';
import { miniRxError } from './mini-rx-error';
import { combineReducers } from './combine-reducers';

export type ReducerManager = ReturnType<typeof createReducerManager>;

function createReducerWithInitialState<StateType extends object>(
    reducer: Reducer<StateType>,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: Action): StateType => {
        return reducer(state, action);
    };
}

function omit<T extends Record<string, any>>(object: T, keyToOmit: keyof T): Partial<T> {
    return Object.keys(object)
        .filter((key) => key !== keyToOmit)
        .reduce<Partial<T>>((prevValue, key: keyof T) => {
            prevValue[key] = object[key];
            return prevValue;
        }, {});
}

export function createReducerManager() {
    let state: ReducerState = {
        featureReducers: {},
        metaReducers: [],
    };

    let _reducer: Reducer<AppState>;

    function _updateStateAndReducer(v: Partial<ReducerState>): void {
        state = {
            ...state,
            ...v,
        };

        const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(state.metaReducers);
        const combinedReducer: Reducer<AppState> = combineReducers(state.featureReducers);
        _reducer = combinedMetaReducer(combinedReducer);
    }

    function setFeatureReducers(featureReducers: ReducerDictionary<AppState>) {
        _updateStateAndReducer({ featureReducers });
    }

    function addFeatureReducer<StateType extends object>(
        featureKey: string,
        reducer: Reducer<StateType>,
        metaReducers?: MetaReducer<StateType>[],
        initialState?: StateType
    ): void {
        if (Object.hasOwn(state.featureReducers, featureKey)) {
            miniRxError(`Feature "${featureKey}" already exists.`);
        }

        reducer = metaReducers?.length
            ? combineMetaReducers<StateType>(metaReducers)(reducer)
            : reducer;

        if (initialState) {
            reducer = createReducerWithInitialState(reducer, initialState);
        }

        _updateStateAndReducer({
            featureReducers: {
                ...state.featureReducers,
                [featureKey]: reducer,
            },
        });
    }

    function removeFeatureReducer(featureKey: string): void {
        _updateStateAndReducer({
            featureReducers: omit(state.featureReducers, featureKey) as ReducerDictionary<AppState>,
        });
    }

    function addMetaReducers(...reducers: MetaReducer<AppState>[]): void {
        _updateStateAndReducer({
            metaReducers: [...state.metaReducers, ...reducers],
        });
    }

    return {
        setFeatureReducers,
        addFeatureReducer,
        removeFeatureReducer,
        addMetaReducers,
        getReducer: () => _reducer,
        // Exported for testing
        _updateStateAndReducer,
    };
}
