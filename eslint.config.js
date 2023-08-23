import unocss from '@unocss/eslint-plugin';
import common from 'eslint-config-neon/flat/common.js';
import edge from 'eslint-config-neon/flat/edge.js';
import next from 'eslint-config-neon/flat/next.js';
import node from 'eslint-config-neon/flat/node.js';
import prettier from 'eslint-config-neon/flat/prettier.js';
import react from 'eslint-config-neon/flat/react.js';
import typescript from 'eslint-config-neon/flat/typescript.js';
import deepMerge from 'ts-deepmerge';

const generalRuleset = Object.freeze(
	deepMerge.withOptions({ mergeArrays: false }, ...common, ...node, ...typescript, {
		files: [
			'{apps,packages}/**/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'{apps,packages}/**/bin/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'{apps,packages}/**/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
		],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.eslint.json', './apps/*/tsconfig.eslint.json', './packages/*/tsconfig.eslint.json'],
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-definitions': [2, 'interface'],
			'jsdoc/no-undefined-types': 1,
		},
	}),
);

const reactRuleset = Object.freeze(
	deepMerge.withOptions({ mergeArrays: false }, generalRuleset, ...react, ...next, ...edge, {
		files: [
			'apps/**/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'apps/**/bin/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'apps/**/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'packages/ui/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
		],
		plugins: {
			'@unocss': unocss,
		},
		rules: {
			'@unocss/order': 2,
			'@next/next/no-html-link-for-pages': 0,
			'react/react-in-jsx-scope': 0,
			'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	}),
);

const prettierRuleset = Object.freeze(
	deepMerge.withOptions({ mergeArrays: false }, ...prettier, {
		files: [
			'{apps,packages}/**/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'{apps,packages}/**/bin/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'{apps,packages}/**/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
		],
	}),
);

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: ['**/.next', '**/coverage', '**/dist', '**/node_modules', '**/.contentlayer', '**/template'],
	},
	generalRuleset,
	reactRuleset,
	{
		files: [
			'packages/rest/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'packages/rest/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
		],
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
		files: [
			'packages/voice/src/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'packages/voice/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
			'packages/voice/__mocks__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
		],
		rules: {
			'import/extensions': 0,
			'no-restricted-globals': 0,
		},
	},
	prettierRuleset,
];
