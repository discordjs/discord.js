// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('local-eslint-config/patch/modern-module-resolution');
// This is a workaround for https://github.com/microsoft/rushstack/issues/3021
require('local-eslint-config/patch/custom-config-package-names');

module.exports = {
  extends: ['local-eslint-config/profile/node', 'local-eslint-config/mixins/friendly-locals'],
  parserOptions: { tsconfigRootDir: __dirname },

  rules: {
    // api-extractor-model uses namespaces to represent mixins
    '@typescript-eslint/no-namespace': 'off'
  }
};
