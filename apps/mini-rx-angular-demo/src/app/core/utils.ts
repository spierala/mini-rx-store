import { fromEvent, merge, Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

const keyDowns$ = fromEvent<KeyboardEvent>(document, 'keydown');
const keyUps$ = fromEvent<KeyboardEvent>(document, 'keyup');
export const altKeyPressed$: Observable<boolean> = merge(keyDowns$, keyUps$).pipe(
    map((e) => e.altKey)
);
