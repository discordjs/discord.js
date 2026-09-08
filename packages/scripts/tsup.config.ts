import { createTsupConfig } from '../../tsup.config.js';

export default [
	createTsupConfig({
		entry: ['src/index.ts', 'bin/generateSplitDocumentation.ts'],
		minify: 'terser',
	}),
	createTsupConfig({
		entry: ['src/populateDevDatabaseBranch.ts', 'bin/sortLabels.ts'],
		format: 'esm',
		minify: 'terser',
	}),
];
