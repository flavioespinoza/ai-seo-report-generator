/** @type {import('jest').Config} */
require('dotenv').config({ path: './.env.local' });
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
      },
      useESM: false,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(cheerio|cheerio-select|dom-serializer|domhandler|domutils|entities|htmlparser2)/)'
  ],
  moduleNameMapper: {
    '^cheerio$': '<rootDir>/node_modules/cheerio/dist/commonjs/index.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}
