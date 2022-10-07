import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	external: ['zlib-sync'],
});
