import jsxA11y from 'eslint-config-neon/oxlint/jsx-a11y';
import prettier from 'eslint-config-neon/oxlint/prettier';
import react from 'eslint-config-neon/oxlint/react';
import { defineConfig } from 'oxlint';

import config from '../../oxlint.config.ts';

export default defineConfig({
	extends: [config, react, jsxA11y, prettier],
	rules: {
		'react/jsx-handler-names': 0,
		'react/only-export-components': 0,
		'react/react-compiler': 2,
		'typescript/unbound-method': 0,
	},
});
