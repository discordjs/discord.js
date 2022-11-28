module.exports = {
	...require('../../.prettierrc.json'),
	plugins: [
		'prettier-plugin-tailwindcss', // MUST come last
	],
	pluginSearchDirs: false,
};
