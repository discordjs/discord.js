import { createUnbuildConfig } from '../../build.config';

export default createUnbuildConfig({
	entries: [
		{ builder: 'rollup', input: 'src/index' },
		{ builder: 'rollup', input: 'src/formatTag/index' },
	],
	preserveModules: false,
	minify: true,
	emitCJS: false,
});
