import { generateId, urlAlphabet } from './generate-id';

describe('generateId', () => {
    it('should generate an id of the given length', () => {
        let id = generateId(1);

        expect(id.length).toBe(1);

        id = generateId(21);

        expect(id.length).toBe(21);
    });

    it('should generate an id of 6 characters long if no argument was passed', () => {
        const id = generateId();

        expect(id.length).toEqual(6);
    });

    it('should generate an id consisting of dashes, underscores, lowercase letters, uppercase letters or digits', () => {
        const id = generateId(10);

        id.split('').forEach((char: string) => {
            expect(urlAlphabet.includes(char)).toBe(true);
        });
    });
});
