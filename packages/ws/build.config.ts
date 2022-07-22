import { createUnbuildConfig } from '../../build.config';

export default createUnbuildConfig({
	entries: [
		{ builder: 'rollup', input: 'src/index' },
		{ builder: 'rollup', input: 'src/strategies/sharding/worker' },
	],
	externals: ['zlib-sync'],
});
