import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

export function createState<StateType extends object>(initialState?: StateType) {
    const stateSource: BehaviorSubject<StateType | undefined> = new BehaviorSubject<
        StateType | undefined
    >(initialState);
    const state$: Observable<StateType> = stateSource.asObservable().pipe(
        // Skip the first (undefined) value of the BehaviorSubject
        // Very similar to a ReplaySubject(1), but more lightweight
        // Emits a state object (when calling the `set` method)
        filter((v) => !!v)
    ) as Observable<StateType>;

    function select(): Observable<StateType>;
    function select<R>(mapFn: (state: StateType) => R): Observable<R>;
    function select(mapFn?: any): Observable<any> {
        if (!mapFn) {
            return state$;
        }
        return state$.pipe(selectOperator(mapFn));
    }

    function get(): StateType | undefined {
        return stateSource.value;
    }

    function set(v: StateType) {
        stateSource.next(v);
    }

    return {
        select,
        get,
        set,
    };
}

function selectOperator<T, R>(mapFn: (state: T) => R) {
    return pipe(map(mapFn), distinctUntilChanged());
}
