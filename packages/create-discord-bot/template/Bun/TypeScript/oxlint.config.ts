import common from 'eslint-config-neon/oxlint/common';
import node from 'eslint-config-neon/oxlint/node';
import prettier from 'eslint-config-neon/oxlint/prettier';
import typescript from 'eslint-config-neon/oxlint/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [common, node, typescript, prettier],
	globals: {
		Bun: 'readonly',
	},
	rules: {
		'import/extensions': 0,
		'no-restricted-globals': 0,
	},
});
