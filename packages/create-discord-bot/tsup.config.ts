import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts'],
	dts: false,
	format: 'esm',
	minify: 'terser',
	keepNames: false,
	sourcemap: false,
});
