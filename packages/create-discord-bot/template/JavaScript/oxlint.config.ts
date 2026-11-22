import common from 'eslint-config-neon/oxlint/common';
import node from 'eslint-config-neon/oxlint/node';
import prettier from 'eslint-config-neon/oxlint/prettier';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [common, node, prettier],
	rules: {
		'jsdoc/check-tag-names': 0,
		'no-restricted-globals': 0,
	},
});
