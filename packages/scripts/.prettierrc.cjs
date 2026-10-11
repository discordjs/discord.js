/** @type {import('prettier').Config} */
module.exports = {
	...require('../../.prettierrc.json'),
	overrides: [
		{
			files: 'turbo/generators/templates/**/{.cliff-jumperrc.json.hbs,api-extractor.json.hbs,package.json.hbs}',
			options: {
				parser: 'json',
			},
		},
		{
			files: 'turbo/generators/templates/**/{.lintstagedrc.cjs.hbs,.prettierrc.cjs.hbs}',
			options: {
				parser: 'babel',
			},
		},
	],
};
