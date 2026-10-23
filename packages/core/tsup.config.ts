import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default [
	createTsupConfig({
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
	createTsupConfig({
		entry: {
			'http-only': 'src/http-only/index.ts',
		},
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
];
