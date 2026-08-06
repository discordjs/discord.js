import common from 'eslint-config-neon/oxlint/common';
import node from 'eslint-config-neon/oxlint/node';
import prettier from 'eslint-config-neon/oxlint/prettier';
import typescript from 'eslint-config-neon/oxlint/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [common, node, typescript, prettier],
	rules: {
		'no-restricted-globals': 0,
	},
});
