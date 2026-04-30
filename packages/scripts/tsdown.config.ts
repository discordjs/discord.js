import { createTsdownConfig } from '../../tsdown.config.js';

export default createTsdownConfig({
	entry: ['src/index.ts', 'src/populateDevDatabaseBranch.ts', 'bin/generateSplitDocumentation.ts', 'bin/sortLabels.ts'],
});
