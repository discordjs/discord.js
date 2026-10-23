import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default [
	createTsupConfig({
		entry: ['src/index.ts'],
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
	createTsupConfig({
		entry: ['src/web.ts'],
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
	createTsupConfig({
		entry: ['src/strategies/*.ts'],
		outDir: 'dist/strategies',
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
];
