import { pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function select<T, R>(mapFn: (state: T) => R) {
    return pipe(map(mapFn), distinctUntilChanged());
}
