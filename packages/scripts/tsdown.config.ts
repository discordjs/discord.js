import { createTsdownConfig } from '../../tsdown.config.js';

export default [
	createTsdownConfig({
		entry: ['src/index.ts', 'bin/generateSplitDocumentation.ts'],
	}),
	createTsdownConfig({
		entry: ['src/populateDevDatabaseBranch.ts', 'bin/sortLabels.ts'],
		format: 'esm',
	}),
];
