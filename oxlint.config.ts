import common from 'eslint-config-neon/oxlint/common';
import edge from 'eslint-config-neon/oxlint/edge';
import jsxA11y from 'eslint-config-neon/oxlint/jsx-a11y';
import next from 'eslint-config-neon/oxlint/next';
import node from 'eslint-config-neon/oxlint/node';
import prettier from 'eslint-config-neon/oxlint/prettier';
import react from 'eslint-config-neon/oxlint/react';
import typescript from 'eslint-config-neon/oxlint/typescript';
import { defineConfig } from 'oxlint';

const commonFiles = '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}';
const plugins = [...new Set([...common.plugins, ...node.plugins, ...typescript.plugins, ...prettier.plugins])];
const reactPlugins = [...new Set([...plugins, ...react.plugins, ...jsxA11y.plugins])];
const nextPlugins = [...new Set([...reactPlugins, ...next.plugins, ...edge.plugins])];

export default defineConfig({
	jsPlugins: ['./packages/discord.js/scripts/oxlint-plugin.mjs'],
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
			rules: {
				...typescript.rules,
				// TypeScript checks duplicate declarations and permits declaration merging.
				'typescript/no-redeclare': 0,
			},
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
				'discordjs/require-strict': 2,
				'discordjs/named-exports': 2,
				'discordjs/destructure-local-require': 2,
				'jsdoc/check-tag-names': [2, { definedTags: ['emits', 'extends', 'method'] }],
				'jsdoc/no-defaults': 0,
				'no-eq-null': 0,
				'no-implicit-globals': 0,
			},
		},
		{
			files: ['packages/discord.js/src/client/websocket/handlers/**/*.js'],
			rules: { 'discordjs/named-exports': 0 },
		},
		{
			files: ['packages/discord.js/typings/*.{d.ts,test-d.ts,d.mts,test-d.mts}'],
			rules: {
				'discordjs/readonly-arrays': 2,
				'discordjs/readonly-collections': 2,
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
		{
			files: [`apps/{guide,website}/${commonFiles}`, `packages/ui/${commonFiles}`],
			plugins: reactPlugins,
			rules: {
				...react.rules,
				...jsxA11y.rules,
				...prettier.rules,
				'react/jsx-handler-names': 0,
				'react/only-export-components': 0,
				'react/error-boundaries': 2,
				'react/globals': 2,
				'react/immutability': 2,
				'react/incompatible-library': 2,
				'react/preserve-manual-memoization': 2,
				'react/purity': 2,
				'react/refs': 2,
				'react/set-state-in-effect': 2,
				'react/set-state-in-render': 2,
				'react/static-components': 2,
				'react/use-memo': 2,
				'react/unsupported-syntax': 2,
				'react/void-use-memo': 2,
				'typescript/unbound-method': 0,
			},
		},
		{
			files: [`apps/{guide,website}/${commonFiles}`],
			plugins: nextPlugins,
			rules: { ...next.rules, ...edge.rules, ...prettier.rules },
		},
		{
			files: ['apps/guide/src/app/layout.tsx'],
			plugins: nextPlugins,
			rules: { 'react/no-unstable-nested-components': 0 },
		},
		{
			files: ['apps/website/src/components/CmdK.tsx'],
			plugins: nextPlugins,
			rules: { 'react/set-state-in-effect': 0 },
		},
		{
			files: ['packages/scripts/src/generateSplitDocumentation.ts'],
			rules: { 'unicorn/consistent-function-scoping': 0 },
		},
	],
	options: {
		reportUnusedDisableDirectives: 'error',
		typeAware: false,
		typeCheck: false,
	},
});
