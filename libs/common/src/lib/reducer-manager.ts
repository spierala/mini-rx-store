import { AppState, MetaReducer, Reducer, ReducerDictionary, Action } from './models';
import { combineReducers } from './combine-reducers';
import { combineMetaReducers } from './combine-meta-reducers';
import { miniRxError } from './mini-rx-error';

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
    let featureReducers: ReducerDictionary<AppState> = {};
    let metaReducers: MetaReducer<AppState>[] = [];
    let reducer: Reducer<any> | undefined = undefined;

    function recalculateReducer(): void {
        const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(metaReducers);
        const combinedReducer: Reducer<AppState> = combineReducers(featureReducers);
        reducer = combinedMetaReducer(combinedReducer);
    }

    function setFeatureReducers(v: ReducerDictionary<AppState>) {
        featureReducers = v;
        recalculateReducer();
    }

    function addFeatureReducer(
        featureKey: string,
        reducer: Reducer<any>,
        metaReducers?: MetaReducer<any>[],
        initialState?: any
    ): void {
        if (Object.hasOwn(featureReducers, featureKey)) {
            miniRxError(`Feature "${featureKey}" already exists.`);
        }

        reducer = metaReducers?.length ? combineMetaReducers(metaReducers)(reducer) : reducer;

        if (initialState) {
            reducer = createReducerWithInitialState(reducer, initialState);
        }

        featureReducers[featureKey] = reducer;

        recalculateReducer();
    }

    function removeFeatureReducer(featureKey: string): void {
        featureReducers = omit(featureReducers, featureKey) as ReducerDictionary<AppState>;

        recalculateReducer();
    }

    function addMetaReducers(...reducers: MetaReducer<AppState>[]): void {
        metaReducers = [...metaReducers, ...reducers];
        recalculateReducer();
    }

    function getReducer(): Reducer<any> {
        if (!reducer) {
            throw new Error();
        }
        return reducer;
    }

    return {
        setFeatureReducers,
        addFeatureReducer,
        removeFeatureReducer,
        addMetaReducers,
        getReducer,
        _reset: () => {
            metaReducers = [];
            featureReducers = {};
        },
    };
}
