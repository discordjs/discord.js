import { createTsupConfig } from '../../tsup.config.js';

export default [
	createTsupConfig({
		minify: 'terser',
	}),
	createTsupConfig({
		entry: ['src/populateDevDatabaseBranch.ts'],
		format: 'esm',
		minify: 'terser',
	}),
];
