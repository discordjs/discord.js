import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: {
		index: 'src/index.ts',
		defaultWorker: 'src/strategies/sharding/defaultWorker.ts',
	},
	external: ['zlib-sync'],
	esbuildPlugins: [esbuildPluginVersionInjector()],
});
