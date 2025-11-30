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
			'jsdoc/check-tag-names': 0,
			'jsdoc/no-undefined-types': 0,
			'jsdoc/valid-types': 0,
		},
	},
];

export default config;
