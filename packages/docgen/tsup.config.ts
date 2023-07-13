import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts', 'src/cli.ts'],
	minify: true,
	dts: false,
});
