import { relative, resolve } from 'node:path';
import glob from 'fast-glob';
import isCi from 'is-ci';
import typescript from 'rollup-plugin-typescript2';
import { defineBuildConfig, BuildEntry } from 'unbuild';

interface ConfigOptions {
	entries: (BuildEntry | string)[];
	minify: boolean;
	emitCJS: boolean;
	externals: string[];
	cjsBridge: boolean;
	sourcemap: boolean;
	preserveModules: boolean;
	preserveModulesRoot: string;
	declaration: boolean;
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
		.map((file) => [`${file.slice(0, -2)}cjs`, `${file.slice(0, -2)}mjs`])
		.flat();

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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				options.output![0] = {
					// @ts-expect-error: This will always be an array
					...options.output![0],
					sourcemap,
					preserveModules,
					preserveModulesRoot,
				};

				if (emitCJS) {
					// @ts-expect-error: This will always be an array
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
