import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Options } from 'tsup';

export const createTsupConfig = ({
	globalName,
	format = ['esm', 'cjs'],
	target = 'es2021',
	sourcemap = true,
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
}: ConfigOptions = {}) =>
	defineConfig({
		clean: true,
		dts: true,
		entry,
		format,
		minify: false,
		skipNodeModulesBundle,
		sourcemap,
		target,
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'tsconfig.json')),
		keepNames: true,
		globalName,
		noExternal,
		esbuildOptions,
	});

type ConfigOptions = Pick<
	Options,
	'globalName' | 'entry' | 'format' | 'target' | 'sourcemap' | 'skipNodeModulesBundle' | 'noExternal' | 'esbuildOptions'
>;
