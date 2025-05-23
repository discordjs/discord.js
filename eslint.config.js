import unocss from '@unocss/eslint-plugin';
import common from 'eslint-config-neon/common';
import edge from 'eslint-config-neon/edge';
import jsxa11y from 'eslint-config-neon/jsx-a11y';
import next from 'eslint-config-neon/next';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import react from 'eslint-config-neon/react';
import typescript from 'eslint-config-neon/typescript';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import reactCompiler from 'eslint-plugin-react-compiler';
// import oxlint from 'eslint-plugin-oxlint';
import merge from 'lodash.merge';
import tseslint from 'typescript-eslint';

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, { files: [`**/*${commonFiles}`] });

const typeScriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	languageOptions: {
		parserOptions: {
			warnOnUnsupportedTypeScriptVersion: false,
			allowAutomaticSingleRunInference: true,
			project: ['tsconfig.eslint.json', 'apps/*/tsconfig.eslint.json', 'packages/*/tsconfig.eslint.json'],
		},
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': [2, 'interface'],
		'@typescript-eslint/naming-convention': [
			2,
			{
				selector: 'typeParameter',
				format: ['PascalCase'],
				custom: {
					regex: '^\\w{3,}',
					match: true,
				},
			},
		],
	},
	settings: {
		'import-x/resolver-next': [
			createTypeScriptImportResolver({
				noWarnOnMultipleProjects: true,
				project: ['tsconfig.eslint.json', 'apps/*/tsconfig.eslint.json', 'packages/*/tsconfig.eslint.json'],
			}),
		],
	},
});

const reactRuleset = merge(...react, {
	files: [`apps/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
	plugins: {
		'react-compiler': reactCompiler,
	},
	rules: {
		'react/jsx-handler-names': 0,
		'react-refresh/only-export-components': [0, { allowConstantExport: true }],
		'react-compiler/react-compiler': 2,
		'jsdoc/no-bad-blocks': 0,
		'tsdoc/syntax': 0,
		'@typescript-eslint/unbound-method': 0,
	},
});

const jsxa11yRuleset = merge(...jsxa11y, { files: [`apps/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`] });

const nextRuleset = merge(...next, { files: [`apps/**/*${commonFiles}`] });

const edgeRuleset = merge(...edge, { files: [`apps/**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

// const oxlintRuleset = merge({ rules: oxlint.rules }, { files: [`**/*${commonFiles}`] });

export default tseslint.config(
	{
		ignores: [
			'**/node_modules/',
			'.git/',
			'**/dist/',
			'**/template/',
			'**/coverage/',
			'**/storybook-static/',
			'**/.next/',
			'**/shiki.bundle.ts',
			'packages/discord.js/',
		],
	},
	commonRuleset,
	nodeRuleset,
	typeScriptRuleset,
	{
		files: ['**/*{ts,mts,cts,tsx}'],
		rules: { 'jsdoc/no-undefined-types': 0 },
	},
	{
		files: [`packages/{api-extractor,brokers,create-discord-bot,docgen,ws}/**/*${commonFiles}`],
		rules: { 'n/no-sync': 0 },
	},
	{
		files: [`packages/api-extractor/**/*${commonFiles}`],
		rules: {
			'consistent-this': 0,
			'unicorn/no-this-assignment': 0,
			'@typescript-eslint/no-this-alias': 0,
		},
	},
	{
		files: [`packages/api-extractor-model/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/no-namespace': 0,
			'no-prototype-builtins': 0,
			'consistent-this': 0,
			'unicorn/no-this-assignment': 0,
			'@typescript-eslint/no-this-alias': 0,
		},
	},
	{
		files: [`packages/{api-extractor,api-extractor-model,api-extractor-utils}/**/*${commonFiles}`],
		rules: {
			'n/prefer-global/process': 0,
			'@typescript-eslint/naming-convention': 0,
			'@typescript-eslint/no-empty-interface': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/switch-exhaustiveness-check': 0,
			'@typescript-eslint/prefer-nullish-coalescing': 0,
		},
	},
	{
		files: [`packages/builders/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/no-empty-object-type': 0,
		},
	},
	{
		files: [`packages/rest/**/*${commonFiles}`],
		rules: {
			'n/prefer-global/url': 0,
			'n/prefer-global/url-search-params': 0,
			'n/prefer-global/buffer': 0,
			'n/prefer-global/process': 0,
			'no-restricted-globals': 0,
			'unicorn/prefer-node-protocol': 0,
		},
	},
	{
		files: [`packages/structures/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-unsafe-declaration-merging': 0,
		},
	},
	{
		files: [`packages/voice/**/*${commonFiles}`],
		rules: {
			'no-restricted-globals': 0,
			'n/prefer-global/buffer': 0,
			'@typescript-eslint/no-unsafe-declaration-merging': 0,
		},
	},
	reactRuleset,
	jsxa11yRuleset,
	{
		files: [`apps/guide/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
		plugins: { '@unocss': unocss },
		rules: {
			'@unocss/order': 2,
		},
	},
	nextRuleset,
	edgeRuleset,
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 0 },
	},
	prettierRuleset,
	// oxlintRuleset,
);
