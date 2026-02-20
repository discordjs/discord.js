import unocss from '@unocss/eslint-plugin';
import { defineConfig } from 'eslint/config';
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

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, {
	files: [`**/*${commonFiles}`],
	rules: {
		'no-restricted-globals': 0,
		'n/prefer-global/buffer': [2, 'never'],
		'n/prefer-global/console': [2, 'always'],
		'n/prefer-global/process': [2, 'never'],
		'n/prefer-global/text-decoder': [2, 'always'],
		'n/prefer-global/text-encoder': [2, 'always'],
		'n/prefer-global/url-search-params': [2, 'always'],
		'n/prefer-global/url': [2, 'always'],
	},
});

const nodeBinRuleset = {
	files: [`**/bin/*{js,mjs,cjs,ts,mts,cts}`],
	rules: {
		'n/shebang': [0],
	},
};

const typeScriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	ignores: [`packages/discord.js/**/*.{js,mjs,cjs}`],
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

export default defineConfig(
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
		],
	},
	commonRuleset,
	nodeRuleset,
	nodeBinRuleset,
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
			'@typescript-eslint/no-duplicate-type-constituents': 0,
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
			'jsdoc/valid-types': 0,
		},
	},
	{
		files: [`packages/discord.js/**/*.{js,cjs}`],
		languageOptions: {
			sourceType: 'commonjs',
			parserOptions: {
				ecmaFeatures: {
					impliedStrict: false,
				},
			},
		},
		settings: {
			jsdoc: {
				tagNamePreference: {
					augments: 'extends',
					fires: 'emits',
					function: 'method',
				},
				preferredTypes: {
					object: 'Object',
					null: 'void',
				},
			},
		},
		rules: {
			'jsdoc/no-undefined-types': 0,
			'jsdoc/no-defaults': 0,
			'no-eq-null': 0,
			strict: ['error', 'global'],

			'no-restricted-syntax': [
				'error',
				{
					selector: "AssignmentExpression[left.object.name='module'][left.property.name='exports']",
					message: 'Use named exports instead of module.exports',
				},
				{
					selector:
						"VariableDeclarator[init.callee.name='require'][init.arguments.0.value=/^\\./]:not([id.type='ObjectPattern'])",
					message: 'Use object destructuring when requiring local modules',
				},
			],
		},
	},
	{
		files: [`packages/discord.js/src/client/websocket/handlers/*.js`],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector:
						"VariableDeclarator[init.callee.name='require'][init.arguments.0.value=/^\\./]:not([id.type='ObjectPattern'])",
					message: 'Use object destructuring when requiring local modules',
				},
			],
		},
	},
	{
		files: [`packages/discord.js/typings/*{d.ts,test-d.ts,d.mts,test-d.mts}`],
		rules: {
			'@typescript-eslint/no-unsafe-declaration-merging': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-use-before-define': 0,
			'@typescript-eslint/consistent-type-imports': 0,
			'@stylistic/lines-between-class-members': 0,
			'@typescript-eslint/no-duplicate-type-constituents': 0,
			'no-restricted-syntax': [
				2,
				{
					selector:
						'MethodDefinition[key.name!=on][key.name!=once][key.name!=off] > TSEmptyBodyFunctionExpression > Identifier :not(TSTypeOperator[operator=readonly]) > TSArrayType',
					message: 'Array parameters on methods must be readonly',
				},
				{
					selector:
						'MethodDefinition > TSEmptyBodyFunctionExpression > Identifier TSTypeReference > Identifier[name=Collection]',
					message: 'Parameters of type Collection on methods must use ReadonlyCollection',
				},
				{
					selector: 'TSDeclareFunction > Identifier :not(TSTypeOperator[operator=readonly]) > TSArrayType',
					message: 'Array parameters on functions must be readonly',
				},
				{
					selector: 'TSDeclareFunction Identifier TSTypeReference > Identifier[name=Collection]',
					message: 'Parameters of type Collection on functions must use ReadonlyCollection',
				},
				{
					selector: 'TSInterfaceDeclaration TSPropertySignature :not(TSTypeOperator[operator=readonly]) > TSArrayType',
					message: 'Array properties on interfaces must be readonly',
				},
				{
					selector: 'TSInterfaceDeclaration TSPropertySignature TSTypeReference > Identifier[name=Collection]',
					message: 'Interface properties of type Collection must use ReadonlyCollection',
				},
			],
		},
	},
	{
		files: [`packages/rest/**/*${commonFiles}`],
		rules: {
			'unicorn/prefer-node-protocol': 0,
		},
	},
	{
		files: [`packages/structures/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/no-empty-interface': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-unsafe-declaration-merging': 0,
		},
	},
	{
		files: [`packages/voice/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/no-unsafe-declaration-merging': 0,
		},
	},
	reactRuleset,
	jsxa11yRuleset,
	{
		files: [`packages/ui/**/*${commonFiles}`],
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
