/** @type {import('lint-staged').Config} */
module.exports = {
	...require('../../.lintstagedrc.json'),
	'src/**.ts': 'vitest related --run --config ./vitest.config.ts',
};
