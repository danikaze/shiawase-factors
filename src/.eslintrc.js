module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  parserOptions: {
    sourceType: 'module',
    globalReturn: true,
  },
  env: {
    browser: true,
    webextensions: true,
  },
  rules: {
    strict: ['error', 'global'],
    'spaced-comment': ['error', 'always', {
      exceptions: ['/'],
    }],
    'max-len': ['error', {
      code: 120,
      ignoreTrailingComments: true,
      ignoreUrls: true,
    }],
    'no-unused-vars': ['error', {
      args: 'none',
    }],
    'no-param-reassign': 'off',
    'no-use-before-define': ['error', {
      functions: false,
    }],
    'no-plusplus': 'off',
    'no-restricted-syntax': [ // allows for-in
      'error',
      'ForOfStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-underscore-dangle': 'off',
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
  },
};
