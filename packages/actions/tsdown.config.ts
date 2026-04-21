import { createTsdownConfig } from '../../tsdown.config.js';

export default createTsdownConfig({
	entry: [
		'src/index.ts',
		'src/formatTag/index.ts',
		'src/releasePackages/index.ts',
		'src/uploadDocumentation/index.ts',
		'src/uploadReadmeFiles/index.ts',
		'src/uploadSearchIndices/index.ts',
		'src/uploadSplitDocumentation/index.ts',
	],
	dts: false,
	format: 'esm',
	target: 'esnext',
});
