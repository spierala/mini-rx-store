import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Action } from 'mini-rx-store';

export function mapResponse<T>(
    mapFn: (next: T) => Action | Action[],
    errorFn: (error: any) => Action | Action[] | void
): (source: Observable<T>) => Observable<Action> {
    return (source) =>
        source.pipe(
            map((v) => mapFn(v)),
            mergeMap((mapFnResult) => {
                return Array.isArray(mapFnResult) ? from(mapFnResult) : of(mapFnResult);
            }),
            catchError((err) => {
                const errorFnResult = errorFn(err);
                return errorFnResult
                    ? Array.isArray(errorFnResult)
                        ? from(errorFnResult)
                        : of(errorFnResult)
                    : EMPTY;
            })
        );
}
