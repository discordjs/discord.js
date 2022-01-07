import type { Options } from 'tsup';

export const tsup: Options = {
	clean: true,
	dts: true,
	entryPoints: ['src/index.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	// if false: causes Collection.constructor to be a minified value like: 'o'
	keepNames: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
};
