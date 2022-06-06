import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['src/index.ts', 'src/formatTag/index.ts'],
	format: ['cjs'],
	minify: true,
	skipNodeModulesBundle: false,
	noExternal: ['@actions/core'],
	sourcemap: true,
	target: 'es2021',
});
