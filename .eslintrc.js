module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:react/recommended',
    'airbnb',
    'plugin:no-unsanitized/DOM',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    },
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  'ignorePatterns': [
    '*.test.tsx',
    '.eslintrc.js',
  ],
  'plugins': [
    'react-hooks',
    'react',
    'jest',
    '@typescript-eslint',
    'babel',
    'eslint-plugin-import-helpers',
  ],
  'rules': {
    // eslint
    'indent': ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/indent': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'camelcase': 0,
    'max-len': [2, 200, 4],
    'arrow-parens': [2, 'as-needed'],
    'consistent-return': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-bitwise': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-case-declarations': 0,
    'no-mixed-operators': 0,
    'no-prototype-builtins': 0,
    'no-restricted-properties': 0,
    'no-return-assign': 0,
    'no-nested-ternary': 0,
    'no-unused-expressions': 0,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 'off',
    'no-confusing-arrow': 0,
    // no-undef is not recommended for typescript projects
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    'no-undef': 0,
    'curly': [0, 'all'],
    'computed-property-spacing': [2, 'never'],
    'object-curly-spacing': [2, 'always', {}],
    'object-curly-newline': 0,
    'object-property-newline': [0, { 'allowAllPropertiesOnSameLine': true }],
    'array-bracket-spacing': [2, 'never'],
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    'no-shadow': 'off',
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    // babel plugin
    'babel/no-unused-expressions': 0,
    // react plugin
    'react/prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.tsx'] }],
    'react/button-has-type': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    // jsx-a11y
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    // typescript-eslint
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-unused-vars': [1, { 'ignoreRestSiblings': true }],
    '@typescript-eslint/member-delimiter-style': 2,
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/no-use-before-define': ['error', { 'functions': false }],
    '@typescript-eslint/type-annotation-spacing': ['error', { 'before': false, 'after': true, overrides: { arrow: { before: true, after: true }}}],
    // eslint-import-helpers
    'import-helpers/order-imports': [
      'error',
      {
        'groups': [
          ['module', 'absolute'],
          '/^(assets|components|configs|store|testUtils|types|hooks|pages|providers|services|utils|layering|rendering|Routes|app|devtools)/',
          'parent',
          'sibling',
        ],
        'newlinesBetween': 'always',
      }
    ],
    // This rule is enabled for tests files only in `overrides` section
    'testing-library/render-result-naming-convention': 'off',
    'import/prefer-default-export': 'off',
    'testing-library/no-debugging-utils': 'off',
  },
  'overrides': [
    {
      'files': ['*.test.tsx','*.spec.tsx'],
      'rules': {
        'testing-library/render-result-naming-convention': 'warn'
      }
    },
    {
      'files': ["**/*.spec.ts", "**/*.spec.tsx", "**/*.ts", "**/*.tsx"],
      'rules': {
        'import/no-extraneous-dependencies': 'off',
      }
    }
  ],
};
