import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['src/docs.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
});
