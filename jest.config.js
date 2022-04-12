export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
