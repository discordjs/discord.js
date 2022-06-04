import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entryPoints: ['src/index.ts'],
	format: ['esm', 'cjs'],
	minify: false,
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
