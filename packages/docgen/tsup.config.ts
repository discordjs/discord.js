import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts', 'bin/index.ts'],
	minify: 'terser',
	keepNames: false,
	sourcemap: false,
});
