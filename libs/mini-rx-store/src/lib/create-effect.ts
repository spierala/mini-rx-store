// TODO add NgRx credits

import { Observable } from 'rxjs';
import { Action } from 'mini-rx-store';
import { EFFECT_METADATA_KEY, HasEffectMetadata, EffectConfig } from './models';

const DEFAULT_EFFECT_CONFIG: Readonly<Required<EffectConfig>> = {
    dispatch: true,
};

type DispatchType<T> = T extends { dispatch: infer U } ? U : true;
type ObservableType<DispatchType, OriginalType> = DispatchType extends false
    ? OriginalType
    : Action;
type EffectType<OT> = Observable<OT>;

export function createEffect<
    C extends EffectConfig,
    DT extends DispatchType<C>,
    OT extends ObservableType<DT, OT>,
    R extends EffectType<OT>
>(v: R, config?: C): R & HasEffectMetadata<C> {
    const value: EffectConfig = {
        ...DEFAULT_EFFECT_CONFIG,
        ...config,
    };
    Object.defineProperty(v, EFFECT_METADATA_KEY, {
        value,
    });
    return v as typeof v & HasEffectMetadata<C>;
}
