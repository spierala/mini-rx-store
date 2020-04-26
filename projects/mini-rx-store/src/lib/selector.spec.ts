import { createSelector } from './selector';

describe('Selectors', () => {
    let countOne: number;
    let countTwo: number;
    let countThree: number;

    let incrementOne: jasmine.Spy;
    let incrementTwo: jasmine.Spy;
    let incrementThree: jasmine.Spy;

    let selectorOne: jasmine.Spy;
    let selectorTwo: jasmine.Spy;
    let selectorThree: jasmine.Spy;

    const firstState = { first: 'state', unchanged: 'state' };
    const secondState = { second: 'state', unchanged: 'state' };
    const thirdState = { third: 'state', unchanged: 'state' };

    beforeEach(() => {
        countOne = 0;
        countTwo = 0;
        countThree = 0;

        incrementOne = jasmine.createSpy('incrementOne').and.callFake(() => {
            ++countOne;
            return countOne;
        });

        incrementTwo = jasmine.createSpy('incrementTwo').and.callFake(() => {
            return ++countTwo;
        });

        incrementThree = jasmine.createSpy('incrementThree').and.callFake(() => {
            return ++countThree;
        });

        selectorOne = jasmine.createSpy('selectorOne').and.callFake(() => {
            return firstState;
        });

        selectorTwo = jasmine.createSpy('selectorTwo').and.callFake(() => {
            return secondState;
        });

        selectorThree = jasmine.createSpy('selectorThree').and.callFake(() => {
            return thirdState;
        });
    });

    describe('createSelector', () => {
        it('should deliver the value of selectors to the projection function', () => {
            const projectFn = jasmine.createSpy('projectionFn');

            const selector = createSelector(incrementOne, incrementTwo, projectFn)(
                {}
            );

            expect(projectFn).toHaveBeenCalledWith(countOne, countTwo);
        });

        it('should call the projector function only when the value of a dependent selector change', () => {
            const neverChangingSelector = jasmine
                .createSpy('unchangedSelector')
                .and.callFake((state: any) => {
                    return state.unchanged;
                });
            const projectFn = jasmine.createSpy('projectionFn');
            const selector = createSelector(neverChangingSelector, projectFn);

            selector(firstState);
            selector(secondState);

            expect(projectFn).toHaveBeenCalledTimes(1);
        });

        it('should memoize the projector function', () => {
            const projectFn = jasmine.createSpy('projectionFn');
            const projectFn2 = jasmine.createSpy('projectionFn2');
            const selector = createSelector(
                // These selectors return always the same objects -> lets memoize the projector
                selectorOne,
                selectorTwo,
                selectorThree,
                projectFn
            );

            selector(firstState);
            selector(firstState);
            selector(firstState);
            selector(secondState);
            selector(secondState);

            expect(selectorOne).toHaveBeenCalledTimes(2);
            expect(selectorTwo).toHaveBeenCalledTimes(2);
            expect(selectorThree).toHaveBeenCalledTimes(2);
            expect(projectFn).toHaveBeenCalledTimes(1);

            const selector2 = createSelector(selector, selectorTwo, projectFn2);
            selector2(firstState);
            selector2(secondState);

            expect(selectorOne).toHaveBeenCalledTimes(4);
            expect(selectorTwo).toHaveBeenCalledTimes(6);
            expect(projectFn).toHaveBeenCalledTimes(1);
            expect(projectFn2).toHaveBeenCalledTimes(1);
        });

        it('should not memoize the projector function', () => {
            const projectFn = jasmine.createSpy('projectionFn');
            const selector = createSelector(
                incrementOne, // This selector always returns new values -> we can not memoize
                selectorOne,
                selectorTwo,
                selectorThree,
                projectFn
            );

            selector(firstState);
            selector(firstState);
            selector(firstState);
            selector(secondState);
            selector(secondState);

            expect(selectorOne).toHaveBeenCalledTimes(2);
            expect(selectorTwo).toHaveBeenCalledTimes(2);
            expect(selectorThree).toHaveBeenCalledTimes(2);
            expect(projectFn).toHaveBeenCalledTimes(2);
        });

        it('should memoize the function', () => {
            const projectFn = jasmine.createSpy('projectionFn');
            const selector = createSelector(
                incrementOne,
                incrementTwo,
                incrementThree,
                projectFn
            );

            selector(firstState);
            selector(firstState);
            selector(firstState);
            selector(secondState);
            selector(secondState);

            expect(incrementOne).toHaveBeenCalledTimes(2);
            expect(incrementTwo).toHaveBeenCalledTimes(2);
            expect(incrementThree).toHaveBeenCalledTimes(2);
            expect(projectFn).toHaveBeenCalledTimes(2);
        });
    });
});
