import globals from 'globals';
import pluginJs from '@eslint/js';

const baseConfig = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 6
  },
  env: {
    node: true,
    browser: true,
    es6: true
  }
};

const customConfig = [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];

// Merge configurations
const mergedConfig = {
  ...baseConfig,
  ...customConfig
};

export default mergedConfig;
