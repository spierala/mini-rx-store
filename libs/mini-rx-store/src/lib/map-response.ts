import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Action } from 'mini-rx-store';

export function mapResponse<T>(
    mapFn: (next: T) => Action | Action[],
    errorFn: (error: any) => Action | Action[] | void
): (source: Observable<T>) => Observable<Action | Action[]> {
    return (source) =>
        source.pipe(
            map(mapFn),
            catchError((err) => {
                const errorFnResult: Action | Action[] | void = errorFn(err);
                return errorFnResult
                    ? Array.isArray(errorFnResult)
                        ? from(errorFnResult)
                        : of(errorFnResult)
                    : EMPTY;
            })
        );
}
