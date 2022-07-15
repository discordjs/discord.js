import { relative, resolve } from 'node:path';
import { defineConfig, type Options } from 'tsup';

type ConfigOptions = Pick<
	Options,
	| 'globalName'
	| 'minify'
	| 'entry'
	| 'format'
	| 'target'
	| 'sourcemap'
	| 'skipNodeModulesBundle'
	| 'noExternal'
	| 'esbuildOptions'
	| 'dts'
	| 'bundle'
>;

export const createTsupConfig = ({
	globalName,
	format = ['esm', 'cjs'],
	dts = true,
	target = 'es2021',
	sourcemap = true,
	minify = false,
	entry = ['src/index.ts'],
	skipNodeModulesBundle = true,
	noExternal,
	esbuildOptions = (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";',
			};
		}
	},
	bundle,
}: ConfigOptions = {}) =>
	defineConfig({
		clean: true,
		dts,
		entry,
		format,
		minify,
		skipNodeModulesBundle,
		sourcemap,
		target,
		tsconfig: relative(__dirname, resolve(process.cwd(), 'tsconfig.json')),
		keepNames: true,
		globalName,
		noExternal,
		esbuildOptions,
		bundle,
		shims: true,
	});
