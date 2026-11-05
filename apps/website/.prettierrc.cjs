/** @type {import('prettier').Config} */
module.exports = {
	...require('../../.prettierrc.json'),
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindFunctions: ['cva', 'cx'],
};
