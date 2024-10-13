import { Observable } from 'rxjs';
import {
    EFFECT_METADATA_KEY,
    EffectConfig,
    hasEffectMetaData,
    HasEffectMetadata,
} from './create-rx-effect';
import { Action } from './models';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';

export function createRxEffectForStore(dispatchFn: (action: Action) => void) {
    function rxEffect(effect$: Observable<any> & HasEffectMetadata): void;
    function rxEffect(effect$: Observable<Action>): void;
    function rxEffect(effect$: any): void {
        const effectWithErrorHandler$: Observable<Action | any> =
            defaultEffectsErrorHandler(effect$);
        effectWithErrorHandler$.subscribe((action) => {
            let shouldDispatch = true;
            if (hasEffectMetaData(effect$)) {
                const metaData: EffectConfig = effect$[EFFECT_METADATA_KEY];
                shouldDispatch = !!metaData.dispatch;
            }
            if (shouldDispatch) {
                dispatchFn(action);
            }
        });
    }

    return rxEffect;
}
