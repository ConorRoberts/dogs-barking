/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest}*/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/tests/dotenv-config.ts"],
  moduleNameMapper: {
    "~/utils/(.*)": "<rootDir>/utils/$1",
    "@config/(.*)": "<rootDir>/config/$1",
    "@schema/(.*)": "<rootDir>/schema/$1",
    "@pages/(.*)": "<rootDir>/pages/$1",
  },
  moduleDirectories: ["node_modules", "utils", "pages", "config", "schema"],
};
