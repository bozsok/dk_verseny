module.exports = {
  // === ALAPBEÁLLÍTÁSOK ===
  rootDir: '.',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    pretendToBeVisual: true
  },

  // === TEST FILES PATTERN ===
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/*.test.js'
  ],

  // === EXCLUDED PATTERNS ===
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/tests/e2e/'
  ],

  // === COVERAGE BEÁLLÍTÁSOK ===
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    // Specifikus fájlok magasabb coverage követelménnyel
    './src/core/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },

  // === COVERAGE COLLECTION ===
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/ui/styles/**',
    '!src/**/*.config.js'
  ],

  // === MODULE NAME MAPPING ===
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1'
  },

  // === MODULE DIRECTORIES ===
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src'
  ],

  // === TRANSFORM BEÁLLÍTÁSOK ===
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // === SETUP FILES ===
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js'
  ],

  // === MOCKS ===
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,

  // === MAX WORKERS ===
  maxWorkers: '50%',

  // === TIMEOUT ===
  testTimeout: 10000,

  // === VERBOSE ===
  verbose: true,

  // === BAIL ===
  bail: false,

  // === FORCE EXIT ===
  forceExit: true,

  // === DETECT OPEN HANDLES ===
  detectOpenHandles: true,

  // === RUNS IN BAND ===
  runInBand: false,

  // === PASS WITH NO TESTS ===
  passWithNoTests: true,

  // === CUSTOM MATCHERS ===
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js',
    '<rootDir>/tests/setup/matchers.js'
  ],

  // === MODULE FILE EXTENSIONS ===
  moduleFileExtensions: [
    'js',
    'json'
  ],

  // === WATCH PLUGINS ===
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // === GLOBAL TEST VARS ===
  globals: {
    __VERSION__: '1.0.0-test',
    __DEV__: true
  },

  // === COVERAGE PATH IGNORES ===
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/jest.config.js',
    '<rootDir>/vite.config.js'
  ],

  // === TEST RESULTS PROCESSOR ===
  testResultsProcessor: 'jest-sonar-reporter',

  // === CUSTOM RESOLVERS ===
  resolver: 'jest-node-exports-resolver',

  // === ERROR ON DEPRECATED ===
  errorOnDeprecated: false,

  // === NOTIFY ===
  notify: false,

  // === NOTIFY MODE ===
  notifyMode: 'failure-change',

  // === TEST SEQUENCER ===
  testSequencer: '<rootDir>/tests/utils/testSequencer.js',

  // === TESTRunner ===
  testRunner: 'jest-circus/runner',

  // === COVERAGE PROVIDER ===
  coverageProvider: 'v8',

  // === PROJECTS ===
  projects: [
    {
      displayName: 'Unit Tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/__tests__/**'
      ]
    }
  ],

  // === REPORTERS ===
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],

  // === TEST PATHS ===
  testPathPatterns: [],

  // === BROWERSLIST ===
  browserslist: [
    '> 1%',
    'last 2 versions',
    'not dead',
    'not ie <= 11'
  ],

  // === PRESET ===
  preset: undefined,

  // === RUNNER ===
  runner: 'jest-runner',

  // === WATCH PATH PATTERNS ===
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],

  // === COVERAGE CHECk ===
  checkCoverage: false,

  // === COVERAGE SUMMARIES ===
  coverageSummaries: true,

  // === EXPOSE GLOBALS ===
  exposeGlobals: true,

  // === TEST ONLY CHANGED ===
  changedSince: undefined,

  // === LAST COMMIT ===
  lastCommit: false,

  // === ONLY CHANGED ===
  onlyChanged: false,

  // === ONLY FAILED ===
  onlyFailures: false,

  // === LIST TESTS ===
  listTests: false,

  // === MAX CONCURRENCY ===
  maxConcurrency: 5,

  // === NODES ===
  workerThreads: false,

  // === HALT ===
  haltOnFail: false,

  // === CI ===
  ci: false,

  // === SHARD ===
  shard: undefined,

  // === SILENT ===
  silent: false,

  // === SILENT DEPRECATED ===
  silentDeprecationWarnings: false,

  // === SKIP PLACEMENT ===
  skipPlacement: false,

  // === TEST ANNOTATION ===
  testAnnotation: {
    failure: 'failed',
    success: 'passed'
  }
};