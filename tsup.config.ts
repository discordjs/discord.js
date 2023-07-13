import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export function createTsupConfig({
	entry = ['src/index.ts'],
	external = [],
	noExternal = [],
	platform = 'node',
	format = ['esm', 'cjs'],
	target = 'es2022',
	skipNodeModulesBundle = true,
	clean = true,
	shims = true,
	minify = false,
	splitting = false,
	keepNames = true,
	dts = true,
	sourcemap = true,
	esbuildPlugins = [],
}: Options = {}) {
	return defineConfig({
		entry,
		external,
		noExternal,
		platform,
		format,
		skipNodeModulesBundle,
		target,
		clean,
		shims,
		minify,
		splitting,
		keepNames,
		dts,
		sourcemap,
		esbuildPlugins,
	});
}
