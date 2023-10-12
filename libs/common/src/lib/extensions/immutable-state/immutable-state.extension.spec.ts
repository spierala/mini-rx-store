import { ImmutableStateExtension } from './immutable-state.extension';

describe('ImmutableStateExtension', () => {
    const instance = new ImmutableStateExtension();

    it('should support ComponentStore', () => {
        expect(instance.hasCsSupport).toBe(true);
    });

    it('should have sort order', () => {
        expect(instance.sortOrder).toBe(0);
    });
});
