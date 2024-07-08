import globals from 'globals';
import pluginJs from '@eslint/js';

export default {
  languageOptions: {
    ecmaVersion: 2023,
    globals: globals.browser,
  },
  ...pluginJs.configs.recommended,
};
