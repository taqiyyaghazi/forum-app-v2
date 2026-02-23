module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'vite.config.ts',
    'react-router.config.ts',
    'build/**',
    '.react-router/**',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y'],
  rules: {
    // Disable max-len because Shadcn and Tailwind class lists are too long
    'max-len': 'off',

    // Allow named exports from files (Airbnb prefers default exports)
    'import/prefer-default-export': 'off',

    // TypeScript handles prop-types
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    // Allow spreading props since Shadcn makes heavy use of it
    'react/jsx-props-no-spreading': 'off',

    // Often useful in React Router configs/loaders
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Ignore empty rest pattern often found in React Router types
    'no-empty-pattern': 'off',

    // Essential for Redux Toolkit (allows state param reassign)
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state'] },
    ],

    // Turn off indent rule since Prettier is better for this
    '@typescript-eslint/indent': 'off',

    // Avoid complaints about missing extensions when importing via alias path like ~/*
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // React Router/Vite relies heavily on devDependencies for tooling/typing
    'import/no-extraneous-dependencies': 'off',

    // React Router components structure often requires this
    'react/jsx-one-expression-per-line': 'off',

    // Welcome file uses resources defined below
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],

    // Disable formatting rules that cause "Definition for rule not found" in the editor
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
};
