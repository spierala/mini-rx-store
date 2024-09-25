import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

export class State<StateType extends object> {
    private stateSource: BehaviorSubject<StateType | undefined> = new BehaviorSubject<
        StateType | undefined
    >(this.initialState);
    state$: Observable<StateType> = this.stateSource.asObservable().pipe(
        // Skip the first (undefined) value of the BehaviorSubject
        // Very similar to a ReplaySubject(1), but more lightweight
        // Emits a state object (when calling the `set` method)
        filter((v) => !!v)
    ) as Observable<StateType>;

    constructor(private initialState?: StateType) {}

    get(): StateType | undefined {
        return this.stateSource.value;
    }

    set(v: StateType) {
        this.stateSource.next(v);
    }

    select(): Observable<StateType>;
    select<R>(mapFn: (state: StateType) => R): Observable<R>;
    select(mapFn?: any): Observable<any> {
        if (!mapFn) {
            return this.state$;
        }
        return this.state$.pipe(select(mapFn));
    }
}

function select<T, R>(mapFn: (state: T) => R) {
    return pipe(map(mapFn), distinctUntilChanged());
}
