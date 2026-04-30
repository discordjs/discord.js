import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

export function createTsdownConfig({
	entry = ['src/index.ts'],
	deps = {
		skipNodeModulesBundle: true,
	},
	platform = 'node',
	format = 'esm',
	target = 'es2022',
	clean = true,
	fixedExtension = false,
	hash = false,
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
		fixedExtension,
		hash,
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

export const versionInjectOptions = (version: string) => ({
	values: [{ find: /\[VI]{{inject}}\[\/VI]/, replacement: version }],
});
