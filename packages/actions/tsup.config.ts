import { createTsupConfig } from '../../tsup.config';

export default createTsupConfig({
	entry: ['src/index.ts', 'src/formatTag/index.ts'],
	format: ['cjs'],
	skipNodeModulesBundle: false,
	noExternal: ['@actions/core'],
	minify: true,
});
