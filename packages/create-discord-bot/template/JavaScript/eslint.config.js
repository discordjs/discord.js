import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';

const config = [
	{
		ignores: [],
	},
	...common,
	...node,
	...prettier,
	{
		rules: {
			'no-restricted-globals': 0,
			'n/prefer-global/buffer': [2, 'never'],
			'n/prefer-global/console': [2, 'always'],
			'n/prefer-global/process': [2, 'never'],
			'n/prefer-global/text-decoder': [2, 'always'],
			'n/prefer-global/text-encoder': [2, 'always'],
			'n/prefer-global/url-search-params': [2, 'always'],
			'n/prefer-global/url': [2, 'always'],
			'jsdoc/check-tag-names': 0,
			'jsdoc/no-undefined-types': 0,
			'jsdoc/valid-types': 0,
		},
	},
];

export default config;
