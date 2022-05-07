import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

type TapResponseObj<T> = {
    nextFn?: (next: T) => void;
    errorFn: (error: any) => void;
};

export function tapResponse<T>(obj?: TapResponseObj<T>): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(
    nextFn: (next: T) => void,
    errorFn: (error: any) => void
): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(functionOrObject: any, function2?: any): any {
    return (source: Observable<T>) =>
        source.pipe(
            tap(
                typeof functionOrObject === 'function'
                    ? {
                          next: functionOrObject,
                          error: function2,
                      }
                    : {
                          next: functionOrObject.nextFn,
                          error: functionOrObject.errorFn,
                      }
            ),
            catchError(() => EMPTY)
        );
}
