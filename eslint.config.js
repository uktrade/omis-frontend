const _import = require('eslint-plugin-import')

const { fixupPluginRules } = require('@eslint/compat')

const globals = require('globals')
const babelParser = require('@babel/eslint-parser')
const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = [
  {
    ignores: ['**/public/', '**/node_modules/'],
  },
  ...compat.extends('plugin:prettier/recommended', 'prettier'),
  {
    plugins: {
      import: fixupPluginRules(_import),
    },
    files: ['**/src/'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: babelParser,
    },

    rules: {
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-prototype-builtins': 'off',

      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],

      'node/no-deprecated-api': 'off',
      'object-curly-newline': 'off',
      'no-else-return': 'off',
      'arrow-body-style': 'off',
      'dot-notation': 'error',

      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],

      'eol-last': 'error',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],

      'no-undef': 'error',

      'no-console': [
        'error',
        {
          allow: ['assert'],
        },
      ],

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external']],
          'newlines-between': 'always-and-inside-groups',
        },
      ],

      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/**.test.{js}'],

    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.browser,
        expect: true,
        proxyquire: true,
        sinon: true,
        nock: true,
        rootPath: true,
        globalReq: true,
        globalRes: true,
      },
    },

    env: {
      jasmine: true,
    },

    rules: {
      'no-unused-expressions': 0,
    },
  },
  {
    files: ['**/test/'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: babelParser,
    },
    rules: {
      'no-undef': 'off',
    },
  },
]
