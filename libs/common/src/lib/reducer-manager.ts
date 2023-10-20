import { BehaviorSubject, map } from 'rxjs';
import { AppState, MetaReducer, Reducer, ReducerDictionary, Action, ReducerState } from './models';
import { combineMetaReducers } from './combine-meta-reducers';
import { miniRxError } from './mini-rx-error';
import { combineReducers } from './combine-reducers';

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
    const _reducerStateSource: BehaviorSubject<ReducerState> = new BehaviorSubject<ReducerState>({
        featureReducers: {},
        metaReducers: [],
    });

    function updateReducerState(v: Partial<ReducerState>): void {
        _reducerStateSource.next({
            ..._reducerStateSource.getValue(),
            ...v,
        });
    }

    function setFeatureReducers(featureReducers: ReducerDictionary<AppState>) {
        updateReducerState({ featureReducers });
    }

    function addFeatureReducer<StateType extends object>(
        featureKey: string,
        reducer: Reducer<StateType>,
        metaReducers?: MetaReducer<StateType>[],
        initialState?: StateType
    ): void {
        if (Object.hasOwn(_reducerStateSource.value.featureReducers, featureKey)) {
            miniRxError(`Feature "${featureKey}" already exists.`);
        }

        reducer = metaReducers?.length
            ? combineMetaReducers<StateType>(metaReducers)(reducer)
            : reducer;

        if (initialState) {
            reducer = createReducerWithInitialState(reducer, initialState);
        }

        updateReducerState({
            featureReducers: {
                ..._reducerStateSource.value.featureReducers,
                [featureKey]: reducer,
            },
        });
    }

    function removeFeatureReducer(featureKey: string): void {
        updateReducerState({
            featureReducers: omit(
                _reducerStateSource.value.featureReducers,
                featureKey
            ) as ReducerDictionary<AppState>,
        });
    }

    function addMetaReducers(...reducers: MetaReducer<AppState>[]): void {
        updateReducerState({
            metaReducers: [..._reducerStateSource.value.metaReducers, ...reducers],
        });
    }

    return {
        setFeatureReducers,
        addFeatureReducer,
        removeFeatureReducer,
        addMetaReducers,
        getReducerObservable: () => {
            return _reducerStateSource.pipe(
                map((v) => {
                    const combinedMetaReducer: MetaReducer<AppState> = combineMetaReducers(
                        v.metaReducers
                    );
                    const combinedReducer: Reducer<AppState> = combineReducers(v.featureReducers);
                    return combinedMetaReducer(combinedReducer);
                })
            );
        },
        // Exported for testing
        _reducerStateSource,
    };
}
