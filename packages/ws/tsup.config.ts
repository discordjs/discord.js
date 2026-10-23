import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default [
	createTsupConfig({
		external: ['zlib-sync'],
		esbuildPlugins: [esbuildPluginVersionInjector()],
	}),
	createTsupConfig({
		entry: {
			defaultWorker: 'src/strategies/sharding/defaultWorker.ts',
		},
	}),
];
