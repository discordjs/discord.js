import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

export function createTsdownConfig({
	entry = ['src/index.ts'],
	deps = {
		skipNodeModulesBundle: true,
	},
	platform = 'node',
	format = ['esm', 'cjs'],
	target = 'es2022',
	clean = true,
	shims = Array.isArray(format) || typeof format === 'string' ? format.includes('cjs') : 'cjs' in format,
	cjsDefault = Array.isArray(format) || typeof format === 'string' ? format.includes('cjs') : 'cjs' in format,
	minify = false,
	dts = true,
	sourcemap = true,
	plugins = [],
	treeshake = false,
	outDir = 'dist',
}: UserConfig = {}) {
	return defineConfig({
		entry,
		deps,
		platform,
		format,
		target,
		clean,
		shims,
		cjsDefault,
		minify,
		dts,
		sourcemap,
		plugins,
		treeshake,
		outDir,
	});
}
