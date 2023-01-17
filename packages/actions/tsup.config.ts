import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts', 'src/formatTag/index.ts'],
	format: ['esm'],
	minify: true,
});
