import { LoggerExtension } from './logger.extension';

describe('LoggerExtension', () => {
    const instance = new LoggerExtension();

    it('should support ComponentStore', () => {
        expect(instance.hasCsSupport).toBe(true);
    });

    it('should have sort order', () => {
        expect(instance.sortOrder).toBe(0);
    });
});
