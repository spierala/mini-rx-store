module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/../../jest.base.setup.ts'],
    verbose: true,
    transform: {
        '\\.(ts|js)x?$': 'ts-jest',
    },
};
