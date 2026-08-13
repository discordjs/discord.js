import common from 'eslint-config-neon/oxlint/common';
import node from 'eslint-config-neon/oxlint/node';
import prettier from 'eslint-config-neon/oxlint/prettier';
import typescript from 'eslint-config-neon/oxlint/typescript';
import { defineConfig } from 'oxlint';

const commonFiles = '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}';
const plugins = [...new Set([...common.plugins, ...node.plugins, ...typescript.plugins, ...prettier.plugins])];

export default defineConfig({
	extends: [common, node, prettier],
	ignorePatterns: [
		'**/node_modules/**',
		'**/dist/**',
		'**/coverage/**',
		'**/storybook-static/**',
		'**/.next/**',
		'**/shiki.bundle.ts',
		'packages/scripts/turbo/generators/templates/**',
	],
	rules: {
		'no-restricted-globals': 0,
		'unicorn/no-abusive-eslint-disable': 0,
	},
	overrides: [
		{
			files: [commonFiles],
			excludeFiles: ['packages/discord.js/**/*.{js,mjs,cjs}'],
			plugins,
			rules: typescript.rules,
		},
		{
			files: [`packages/{api-extractor,brokers,create-discord-bot,docgen,ws}/${commonFiles}`],
			rules: {
				'node/no-sync': 0,
			},
		},
		{
			files: [`packages/api-extractor/${commonFiles}`],
			rules: {
				'id-length': 0,
				'promise/prefer-await-to-then': 0,
				'typescript/no-duplicate-type-constituents': 0,
				'typescript/no-this-alias': 0,
				'unicorn/no-this-assignment': 0,
			},
		},
		{
			files: [`packages/api-extractor-model/${commonFiles}`],
			rules: {
				'id-length': 0,
				'no-inner-declarations': 0,
				'no-prototype-builtins': 0,
				'typescript/no-namespace': 0,
				'typescript/no-this-alias': 0,
				'unicorn/consistent-function-scoping': 0,
				'unicorn/no-this-assignment': 0,
			},
		},
		{
			files: [`packages/api-extractor-utils/${commonFiles}`],
			rules: {
				'unicorn/consistent-function-scoping': 0,
			},
		},
		{
			files: [`packages/brokers/${commonFiles}`],
			rules: {
				'id-length': 0,
			},
		},
		{
			files: [`packages/{api-extractor,api-extractor-model,api-extractor-utils}/${commonFiles}`],
			rules: {
				'typescript/no-empty-interface': 0,
				'typescript/no-empty-object-type': 0,
				'typescript/prefer-nullish-coalescing': 0,
				'typescript/switch-exhaustiveness-check': 0,
			},
		},
		{
			files: [`packages/builders/${commonFiles}`],
			rules: {
				'typescript/no-empty-object-type': 0,
			},
		},
		{
			files: [`packages/collection/${commonFiles}`],
			rules: {
				'typescript/no-unsafe-declaration-merging': 0,
			},
		},
		{
			files: ['packages/discord.js/src/**/*.{js,cjs}'],
			rules: {
				'jsdoc/check-tag-names': [2, { definedTags: ['emits', 'extends', 'method'] }],
				'jsdoc/no-defaults': 0,
				'no-eq-null': 0,
				'no-implicit-globals': 0,
			},
		},
		{
			files: ['packages/discord.js/typings/*.{d.ts,test-d.ts,d.mts,test-d.mts}'],
			rules: {
				'id-length': 0,
				'promise/prefer-await-to-then': 0,
				'typescript/consistent-type-imports': 0,
				'typescript/no-duplicate-type-constituents': 0,
				'typescript/no-empty-object-type': 0,
				'typescript/no-unsafe-declaration-merging': 0,
				'typescript/no-use-before-define': 0,
			},
		},
		{
			files: [`packages/core/${commonFiles}`],
			rules: {
				'typescript/no-invalid-void-type': 0,
			},
		},
		{
			files: [`packages/rest/${commonFiles}`],
			rules: {
				'unicorn/prefer-node-protocol': 0,
			},
		},
		{
			files: [`packages/structures/${commonFiles}`],
			rules: {
				'typescript/no-empty-interface': 0,
				'typescript/no-empty-object-type': 0,
				'typescript/no-unsafe-declaration-merging': 0,
			},
		},
		{
			files: [`packages/voice/${commonFiles}`],
			rules: {
				'typescript/no-unsafe-declaration-merging': 0,
			},
		},
		{
			files: ['packages/ws/__tests__/**/*.test-d.{ts,mts}'],
			rules: {
				'id-length': 0,
			},
		},
	],
	options: {
		reportUnusedDisableDirectives: 'off',
		typeAware: false,
		typeCheck: false,
	},
});
