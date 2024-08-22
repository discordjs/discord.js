/** @type {import('lint-staged').Config} */
module.exports = {
	...require('../../.lintstagedrc.json'),
	'src/**.ts': 'jest --coverage --findRelatedTests',
};
