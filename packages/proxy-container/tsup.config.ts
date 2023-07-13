import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	format: ['esm'],
	minify: true,
});
