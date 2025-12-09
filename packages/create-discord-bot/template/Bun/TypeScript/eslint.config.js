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
			parserOptions: {
				project: ['./tsconfig.eslint.json'],
			},
		},
		rules: {
			'import/extensions': 0,
		},
	},
];

export default config;
