import { EMPTY, finalize, identity, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

type TapResponseObj<T> = {
    nextFn?: (next: T) => void;
    errorFn: (error: any) => void;
    finalizeFn?: () => void;
};

export function tapResponse<T>(obj?: TapResponseObj<T>): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(
    nextFn: (next: T) => void,
    errorFn: (error: any) => void,
    finalizeFn?: () => void
): (source: Observable<T>) => Observable<T>;
export function tapResponse<T>(fn1OrObject: any, fn2?: any, fn3?: any): any {
    return (source: Observable<T>) => {
        const tapResponseObj: TapResponseObj<T> =
            typeof fn1OrObject === 'function'
                ? {
                      nextFn: fn1OrObject,
                      errorFn: fn2,
                      finalizeFn: fn3,
                  }
                : fn1OrObject;

        return source.pipe(
            tap({
                next: tapResponseObj.nextFn,
                error: tapResponseObj.errorFn,
            }),
            catchError(() => EMPTY),
            tapResponseObj.finalizeFn ? finalize(tapResponseObj.finalizeFn) : identity // Conditionally apply operator: https://rxjs.dev/api/index/function/identity
        );
    };
}
