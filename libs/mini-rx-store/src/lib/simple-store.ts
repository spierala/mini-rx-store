import { BehaviorSubject, Observable } from 'rxjs';
import { select } from './utils';
import { StateOrCallback } from './models';
import { calcNewState } from './feature-store';

export class SimpleStore<T> {
    private stateSource: BehaviorSubject<T> = new BehaviorSubject(this.initialState);
    state$: Observable<T> = this.stateSource.asObservable();
    get state(): T {
        return this.stateSource.getValue();
    }

    constructor(private initialState: T) {}

    select(): Observable<T>;
    select<R>(mapFn: (state: T) => R): Observable<R>;
    select(mapFn?: any): Observable<any> {
        if (!mapFn) {
            return this.state$;
        }
        return this.state$.pipe(select(mapFn));
    }

    setState(stateOrCallback: StateOrCallback<T>): void {
        this.stateSource.next(calcNewState(this.state, stateOrCallback));
    }
}
