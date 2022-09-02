import { relative, resolve } from 'node:path';
import glob from 'fast-glob';
import isCi from 'is-ci';
import typescript from 'rollup-plugin-typescript2';
import { defineBuildConfig, type BuildEntry } from 'unbuild';

interface ConfigOptions {
	cjsBridge: boolean;
	declaration: boolean;
	emitCJS: boolean;
	entries: (BuildEntry | string)[];
	externals: string[];
	minify: boolean;
	preserveModules: boolean;
	preserveModulesRoot: string;
	sourcemap: boolean;
	typeCheck: boolean;
}

export function createUnbuildConfig({
	entries = [{ builder: 'rollup', input: 'src/index' }],
	minify = false,
	emitCJS = true,
	cjsBridge = true,
	externals = [],
	sourcemap = true,
	preserveModules = true,
	preserveModulesRoot = 'src',
	declaration = true,
	typeCheck = isCi,
}: Partial<ConfigOptions> = {}) {
	const files = glob
		.sync('**', { cwd: 'src' })
		.flatMap((file) => [`${file.slice(0, -2)}cjs`, `${file.slice(0, -2)}mjs`]);

	return defineBuildConfig({
		entries,
		clean: true,
		rollup: {
			esbuild: {
				minify,
				minifyIdentifiers: false,
			},
			emitCJS,
			cjsBridge,
			json: {
				namedExports: false,
				preferConst: true,
			},
		},

		externals: [...files, ...externals],

		hooks: {
			'rollup:options': (_, options) => {
				// @ts-expect-error: This will always be an array
				options.output![0] = {
					// @ts-expect-error: This will always be an array
					...options.output![0],
					sourcemap,
					preserveModules,
					preserveModulesRoot,
				};

				if (emitCJS) {
					// @ts-expect-error: This will always be an array
					options.output![1] = {
						// @ts-expect-error: This will always be an array
						...options.output![1],
						sourcemap,
						preserveModules,
						preserveModulesRoot,
					};
				}

				if (declaration) {
					options.plugins?.unshift(
						typescript({
							check: typeCheck,
							tsconfig: relative(__dirname, resolve(process.cwd(), 'tsconfig.json')),
							tsconfigOverride: {
								compilerOptions: {
									emitDeclarationOnly: true,
								},
							},
						}),
					);
				}
			},
		},
	});
}
