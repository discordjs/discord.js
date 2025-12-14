import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import typescript from 'eslint-config-neon/typescript';

const config = [
	{
		ignores: [],
	},
	...common,
	...node,
	...typescript,
	...prettier,
	{
		languageOptions: {
			globals: {
				Bun: 'readonly',
			},
			parserOptions: {
				project: ['./tsconfig.eslint.json'],
			},
		},
		rules: {
			'no-restricted-globals': 0,
			'n/prefer-global/buffer': [2, 'never'],
			'n/prefer-global/console': [2, 'always'],
			'n/prefer-global/process': [2, 'never'],
			'n/prefer-global/text-decoder': [2, 'always'],
			'n/prefer-global/text-encoder': [2, 'always'],
			'n/prefer-global/url-search-params': [2, 'always'],
			'n/prefer-global/url': [2, 'always'],
			'import/extensions': 0,
		},
	},
];

export default config;
