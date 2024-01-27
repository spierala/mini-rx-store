import { Subscription } from 'rxjs';
import { miniRxError } from './mini-rx-error';

export function createSubSink() {
    let subs: Subscription | undefined = new Subscription();

    return {
        sink(sub: Subscription) {
            if (!subs) {
                miniRxError('Store has already been destroyed.');
            }
            subs?.add(sub);
        },
        unsubscribe: () => {
            subs?.unsubscribe();
            subs = undefined;
        },
    };
}
