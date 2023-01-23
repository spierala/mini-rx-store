// Credits go to NgRx
// Copied from with small modifications: https://github.com/ngrx/platform/blob/14.3.0/modules/effects/src/effect_creator.ts

// The MIT License (MIT)
//
// Copyright (c) 2017-2022 Brandon Roberts, Mike Ryan, Victor Savkin, Rob Wormald
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Observable } from 'rxjs';
import { Action, EFFECT_METADATA_KEY, EffectConfig, HasEffectMetadata } from './models';

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
>(v: R, config?: C): R & HasEffectMetadata {
    const value: EffectConfig = {
        ...DEFAULT_EFFECT_CONFIG,
        ...config,
    };
    Object.defineProperty(v, EFFECT_METADATA_KEY, {
        value,
    });
    return v as typeof v & HasEffectMetadata;
}
