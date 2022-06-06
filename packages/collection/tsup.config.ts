import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['src/index.ts'],
	format: ['esm', 'cjs'],
	minify: false,
	// if false: causes Collection.constructor to be a minified value like: 'o'
	keepNames: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
	esbuildOptions: (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";',
			};
		}
	},
});
