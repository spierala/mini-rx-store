// Credits to NgRx: https://github.com/ngrx/platform/blob/8.6.0/modules/store/spec/selector.spec.ts

import {
    addSignalSelectorKey,
    createFeatureStateSelector,
    createSelector,
} from '../signal-selector';
import { computed, Signal, signal, WritableSignal } from '@angular/core';

describe('Selectors', () => {
    describe('createSelector', () => {
        it('should deliver the value of selectors to the projection function', () => {
            const selector1 = createSelector(createFeatureStateSelector(), () => 1);
            const selector2 = createSelector(createFeatureStateSelector(), () => 2);
            const projectFn = jest.fn<void, [number, number]>();

            const selector = createSelector(selector1, selector2, projectFn);

            const selectedState = selector(signal({}));
            selectedState(); // Read Signal

            expect(projectFn.mock.calls).toEqual([[1, 2]]);
        });

        it('should call the projector function only when the value of a dependent selector change', () => {
            const state = signal({ someProp: 1, unchanged: 'state' });
            const neverChangingSelector = createFeatureStateSelector<string>('unchanged');
            const projectFn = jest.fn<void, [string]>();
            const selector = createSelector(neverChangingSelector, projectFn);

            const selectedState = selector(state);
            selectedState();

            state.set({ someProp: 2, unchanged: 'state' }); // Change only someProp
            selectedState();

            expect(projectFn).toHaveBeenCalledTimes(1);
        });

        it('should run computed callback only if dependent state signal changes', () => {
            const firstState = 1;
            const secondState = 2;

            const selector1Spy = jest.fn();
            const selector1 = (state: Signal<any>) => {
                return computed(() => {
                    selector1Spy();
                    return state();
                });
            };

            const selector2Spy = jest.fn();
            const selector2 = (state: Signal<any>) => {
                return computed(() => {
                    selector2Spy();
                    return state();
                });
            };

            const selector3Spy = jest.fn();
            const selector3 = (state: Signal<any>) => {
                return computed(() => {
                    selector3Spy();
                    return state();
                });
            };
            const projectFn = jest.fn();

            const signalState: WritableSignal<number> = signal(firstState);

            const selector = createSelector(
                // Use `addSignalSelectorKey` to make selector compatible with `createSelector`
                addSignalSelectorKey(selector1),
                addSignalSelectorKey(selector2),
                addSignalSelectorKey(selector3),
                projectFn
            );

            const selectedState = selector(signalState);

            signalState.set(firstState);
            selectedState(); // read Signal
            signalState.set(firstState);
            selectedState(); // read Signal
            signalState.set(firstState);
            selectedState(); // read Signal
            signalState.set(secondState);
            selectedState(); // read Signal
            signalState.set(secondState);
            selectedState(); // read Signal

            expect(selector1Spy).toHaveBeenCalledTimes(2);
            expect(selector2Spy).toHaveBeenCalledTimes(2);
            expect(selector3Spy).toHaveBeenCalledTimes(2);
            expect(projectFn).toHaveBeenCalledTimes(2);
        });

        // it('should not memoize last successful projection result in case of error', () => {
        //     const firstState = { ok: true };
        //     const secondState = { ok: false };
        //     const fail = () => {
        //         throw new Error();
        //     };
        //     const projectorFn = jasmine
        //         .createSpy('projectorFn', (s: any) => (s.ok ? s.ok : fail()))
        //         .and.callThrough();
        //     const selectorFn = jasmine
        //         .createSpy(
        //             'selectorFn',
        //             createSelector(addSignalSelectorKey((state) => state), projectorFn)
        //         )
        //         .and.callThrough();
        //
        //     selectorFn(firstState);
        //
        //     expect(() => selectorFn(secondState)).toThrow(new Error());
        //     expect(() => selectorFn(secondState)).toThrow(new Error());
        //
        //     selectorFn(firstState);
        //     expect(selectorFn).toHaveBeenCalledTimes(4);
        //     expect(projectorFn).toHaveBeenCalledTimes(3);
        // });
    });
});

function signalEquality(a: any, b: any) {
    return a === b;
}
