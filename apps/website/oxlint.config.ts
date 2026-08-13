import edge from 'eslint-config-neon/oxlint/edge';
import jsxA11y from 'eslint-config-neon/oxlint/jsx-a11y';
import next from 'eslint-config-neon/oxlint/next';
import prettier from 'eslint-config-neon/oxlint/prettier';
import react from 'eslint-config-neon/oxlint/react';
import { defineConfig } from 'oxlint';

import config from '../../oxlint.config.ts';

export default defineConfig({
	extends: [config, react, jsxA11y, next, edge, prettier],
	rules: {
		'react/jsx-handler-names': 0,
		'react/only-export-components': 0,
		'react/react-compiler': 2,
		'typescript/unbound-method': 0,
	},
	overrides: [
		{
			files: ['src/components/CmdK.tsx'],
			rules: {
				'react/react-compiler': 0,
			},
		},
	],
});
