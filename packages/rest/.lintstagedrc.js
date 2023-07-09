module.exports = {
	...require('../../.lintstagedrc.json'),
	'src/**.ts': 'vitest related --run',
};
