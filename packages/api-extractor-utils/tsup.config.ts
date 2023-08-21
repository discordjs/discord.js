import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	minify: 'terser',
	keepNames: false,
});
