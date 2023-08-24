import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['bin/index.ts'],
	dts: false,
	format: 'esm',
	minify: 'terser',
	keepNames: false,
	sourcemap: false,
});
