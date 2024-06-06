import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: [
		'src/index.ts',
		'src/formatTag/index.ts',
		'src/uploadDocumentation/index.ts',
		'src/uploadSearchIndices/index.ts',
		'src/uploadSplitDocumentation/index.ts',
	],
	dts: false,
	format: 'esm',
	minify: 'terser',
});
