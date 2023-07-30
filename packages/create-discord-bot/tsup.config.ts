import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts'],
	dts: false,
	format: 'esm',
	minify: true,
	sourcemap: false,
});
