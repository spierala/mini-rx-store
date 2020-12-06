import { StoreExtension } from './interfaces';
import { tap, withLatestFrom } from 'rxjs/operators';
import StoreCore from './store-core';

export class LoggerExtension implements StoreExtension {
    init(): void {
        StoreCore.actions$.pipe(
            withLatestFrom(StoreCore.state$),
            tap(([action, state]) => log(action, state))
        ).subscribe();
    }
}

function log(action, state) {
    console.log(
        '%cACTION',
        'font-weight: bold; color: #ff9900',
        '\nType:',
        action.type,
        '\nPayload: ',
        action.payload,
        '\nState: ',
        state
    );
}
