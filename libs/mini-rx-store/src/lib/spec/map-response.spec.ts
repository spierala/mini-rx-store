import { noop, Observable, of, throwError } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { Action, mapResponse } from 'mini-rx-store';

describe('mapResponse', () => {
    it('should invoke next callback on next', () => {
        const nextCallback = jest.fn<Action, [number]>();

        of(1, 2, 3).pipe(mapResponse(nextCallback, noop)).subscribe();

        expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);

        // nextCallback.mockReset();

        // with object parameter
        // of(1, 2, 3)
        //     .pipe(tapResponse({ next: nextCallback, error: noop }))
        //     .subscribe();
        //
        // expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);
    });

    it('should invoke error callback on error', () => {
        const nextCallback = jest.fn<Action, [number]>();
        const errorCallback = jest.fn<Action, [{ message: string }]>();
        const error = { message: 'error' };

        throwError(() => error)
            .pipe(mapResponse(nextCallback, errorCallback))
            .subscribe();

        expect(errorCallback).toHaveBeenCalledWith(error);

        // errorCallback.mockReset();

        // with object parameter
        // throwError(() => error)
        //     .pipe(tapResponse({ error: errorCallback }))
        //     .subscribe();
        //
        // expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should not unsubscribe from outer observable on inner observable error', () => {
        const innerCompleteCallback = jest.fn<void, []>();
        const outerCompleteCallback = jest.fn<void, []>();

        new Observable((subscriber) => subscriber.next(1))
            .pipe(
                concatMap(() =>
                    throwError(() => 'error').pipe(
                        mapResponse(() => ({ type: 'some action' }), noop),
                        finalize(innerCompleteCallback)
                    )
                ),
                finalize(outerCompleteCallback)
            )
            .subscribe();

        expect(innerCompleteCallback).toHaveBeenCalled();
        expect(outerCompleteCallback).not.toHaveBeenCalled();
    });

    it('should return one or many actions on next', () => {
        const nextCallback = jest.fn<Action, [number]>();

        of(1, 2, 3).pipe(mapResponse(nextCallback, noop)).subscribe();

        expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);

        // nextCallback.mockReset();

        // with object parameter
        // of(1, 2, 3)
        //     .pipe(tapResponse({ next: nextCallback, error: noop }))
        //     .subscribe();
        //
        // expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);
    });
});
