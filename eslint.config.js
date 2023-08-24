import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import unocss from '@unocss/eslint-plugin';
import common from 'eslint-config-neon/flat/common.js';
import edge from 'eslint-config-neon/flat/edge.js';
import next from 'eslint-config-neon/flat/next.js';
import node from 'eslint-config-neon/flat/node.js';
import prettier from 'eslint-config-neon/flat/prettier.js';
import react from 'eslint-config-neon/flat/react.js';
import typescript from 'eslint-config-neon/flat/typescript.js';
import merge from 'lodash.merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, { files: [`**/*${commonFiles}`] });

const typeScriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	languageOptions: {
		parserOptions: {
			allowAutomaticSingleRunInference: true,
			tsconfigRootDir: __dirname,
			project: ['./tsconfig.eslint.json', './apps/*/tsconfig.eslint.json', './packages/*/tsconfig.eslint.json'],
		},
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': [2, 'interface'],
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: ['./tsconfig.eslint.json', './apps/*/tsconfig.eslint.json', './packages/*/tsconfig.eslint.json'],
			},
		},
	},
});

const reactRuleset = merge(...react, {
	files: [`apps/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
	plugins: { '@unocss': unocss },
	rules: {
		'@unocss/order': 2,
		'@next/next/no-html-link-for-pages': 0,
		'react/react-in-jsx-scope': 0,
		'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
	},
});

const nextRuleset = merge(...next, { files: [`apps/**/*${commonFiles}`] });

const edgeRuleset = merge(...edge, { files: [`apps/**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: [
			'**/node_modules/',
			'.git/',
			'**/dist/',
			'**/template/',
			'**/coverage/',
			'**/storybook-static/',
			'**/.next/',
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
		files: [`packages/docgen/**/*${commonFiles}`],
		rules: { 'import/extensions': 0 },
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
		files: [`packages/voice/**/*${commonFiles}`],
		rules: {
			'import/extensions': 0,
			'no-restricted-globals': 0,
		},
	},
	nextRuleset,
	edgeRuleset,
	reactRuleset,
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 0 },
	},
	prettierRuleset,
];
